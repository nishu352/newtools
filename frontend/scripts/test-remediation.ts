import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { PDFDocument, PDFName, PDFString, PDFHexString, PDFArray } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

async function main() {
  console.log('Testing PDF/A-1b remediation...');
  
  // 1. Load font
  const fontPath = path.resolve('node_modules/pdfjs-dist/standard_fonts/LiberationSans-Regular.ttf');
  const fontBytes = fs.readFileSync(fontPath);
  console.log('Loaded LiberationSans font:', fontBytes.length, 'bytes');

  // 2. Load sRGB ICC profile
  const iccPath = path.resolve('C:/Windows/System32/spool/drivers/color/sRGB Color Space Profile.icm');
  const iccBytes = fs.readFileSync(iccPath);
  console.log('Loaded sRGB ICC profile:', iccBytes.length, 'bytes');

  const doc = await PDFDocument.create();
  console.log('trailerInfo before:', (doc.context as any).trailerInfo);
  const hexId1 = PDFHexString.of('A1B2C3D4E5F60718293A4B5C6D7E8F90');
  const hexId2 = PDFHexString.of('A1B2C3D4E5F60718293A4B5C6D7E8F90');
  (doc.context as any).trailerInfo.ID = doc.context.obj([hexId1, hexId2]);
  doc.registerFontkit(fontkit);
  const font = await doc.embedFont(fontBytes, { subset: true });

  const page = doc.addPage([612, 792]);
  page.drawText('Hello PDF/A-1b World with embedded LiberationSans font!', {
    x: 50,
    y: 700,
    size: 14,
    font,
  });

  // Timestamp
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = now.getUTCFullYear();
  const month = pad(now.getUTCMonth() + 1);
  const day = pad(now.getUTCDate());
  const hour = pad(now.getUTCHours());
  const min = pad(now.getUTCMinutes());
  const sec = pad(now.getUTCSeconds());
  
  const isoUtc = `${year}-${month}-${day}T${hour}:${min}:${sec}Z`;
  const pdfUtc = `D:${year}${month}${day}${hour}${min}${sec}Z`;

  // Info dictionary
  const title = 'PDF/A Remediated Document';
  const author = 'OminiTools User';
  const producer = 'OminiTools PDF/A Converter';
  const creator = 'OminiTools PDF/A Converter';

  doc.setTitle(title);
  doc.setAuthor(author);
  doc.setProducer(producer);
  doc.setCreator(creator);
  doc.setCreationDate(now);
  doc.setModificationDate(now);

  // XMP metadata
  const xmpMetadata = `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="OminiTools PDF/A Converter">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
        xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
      <pdfaid:part>1</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>
    </rdf:Description>
    <rdf:Description rdf:about=""
        xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${title}</rdf:li></rdf:Alt></dc:title>
      <dc:creator><rdf:Seq><rdf:li>${author}</rdf:li></rdf:Seq></dc:creator>
      <dc:date><rdf:Seq><rdf:li>${isoUtc}</rdf:li></rdf:Seq></dc:date>
    </rdf:Description>
    <rdf:Description rdf:about=""
        xmlns:xmp="http://ns.adobe.com/xap/1.0/">
      <xmp:CreatorTool>${creator}</xmp:CreatorTool>
      <xmp:CreateDate>${isoUtc}</xmp:CreateDate>
      <xmp:ModifyDate>${isoUtc}</xmp:ModifyDate>
    </rdf:Description>
    <rdf:Description rdf:about=""
        xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
      <pdf:Producer>${producer}</pdf:Producer>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

  // Attach XMP
  const metadataStream = doc.context.stream(xmpMetadata, {
    Type: 'Metadata',
    Subtype: 'XML',
  });
  const metadataRef = doc.context.register(metadataStream);
  doc.catalog.set(PDFName.of('Metadata'), metadataRef);

  // ICC Profile stream
  const iccStream = doc.context.stream(iccBytes, {
    N: 3,
  });
  const iccStreamRef = doc.context.register(iccStream);

  // OutputIntent
  const outputIntentDict = doc.context.obj({
    Type: 'OutputIntent',
    S: 'GTS_PDFA1',
    OutputConditionIdentifier: PDFString.of('sRGB IEC61966-2.1'),
    Info: PDFString.of('sRGB IEC61966-2.1'),
    RegistryName: PDFString.of('http://www.color.org'),
    DestOutputProfile: iccStreamRef,
  });
  const outputIntentRef = doc.context.register(outputIntentDict);
  doc.catalog.set(PDFName.of('OutputIntents'), doc.context.obj([outputIntentRef]));

  // Save
  let data = await doc.save({ useObjectStreams: false });

  // In-place rewrite to %PDF-1.4
  const headerPrefix = new TextDecoder().decode(data.subarray(0, 8));
  if (headerPrefix.startsWith('%PDF-1.')) {
    data[7] = 0x34; // '4'
  }

  // Check Trailer /ID
  // Let's see what the trailer has
  let text = Buffer.from(data).toString('latin1');
  const trailerIdx = text.lastIndexOf('trailer');
  console.log('Trailer snippet:', text.slice(trailerIdx, trailerIdx + 200));

  const outPath = path.resolve('scripts/pdfa-fixtures/test_remediated.pdf');
  fs.writeFileSync(outPath, data);
  console.log('Saved', outPath);

  // Run veraPDF
  const verapdfBat = path.resolve('../verapdf.bat');
  try {
    const cmd = `"${verapdfBat}" --flavour 1b -v --format text "${outPath}"`;
    const res = execSync(cmd, { encoding: 'utf8' });
    console.log('veraPDF output:\n', res);
  } catch (err: any) {
    console.log('veraPDF failed:\n', err.stdout || err.message);
  }
}

main().catch(console.error);
