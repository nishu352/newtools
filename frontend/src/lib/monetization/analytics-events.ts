/**
 * Typed analytics event contract for OmniTools.
 *
 * PRIVACY RULES (enforced by type system):
 *   - No user-generated content may appear in event payloads.
 *   - Events identify WHAT action occurred, not WHAT DATA was processed.
 *   - toolId and category are registry identifiers, not user input.
 */

/** All allowed high-level analytics event names. */
export type AnalyticsEventName =
  | 'page_view'
  | 'tool_opened'
  | 'tool_completed'
  | 'tool_copied'
  | 'tool_downloaded'
  | 'category_viewed'
  | 'resource_viewed'
  | 'search_performed';

/**
 * Base payload shared by all events.
 * Contains only platform identifiers — never user content.
 */
interface BaseEventPayload {
  /** ISO-8601 timestamp. Added automatically by track(). */
  readonly timestamp?: string;
}

/** Fired when a tool page becomes visible. */
export interface ToolOpenedPayload extends BaseEventPayload {
  toolId: string;
  toolSlug: string;
  category: string;
}

/** Fired when a tool successfully produces a result. */
export interface ToolCompletedPayload extends BaseEventPayload {
  toolId: string;
  toolSlug: string;
  category: string;
  /**
   * Optional: duration in ms for the tool computation.
   * Must never contain the computation result itself.
   */
  durationMs?: number;
}

/** Fired when a user copies the tool result. */
export interface ToolCopiedPayload extends BaseEventPayload {
  toolId: string;
  toolSlug: string;
}

/** Fired when a user downloads a file result. */
export interface ToolDownloadedPayload extends BaseEventPayload {
  toolId: string;
  toolSlug: string;
  /** Format identifier only — e.g. "json", "txt", "png". Never file contents. */
  format?: string;
}

/** Fired when a category page is viewed. */
export interface CategoryViewedPayload extends BaseEventPayload {
  categorySlug: string;
}

/** Fired when a resource guide page is viewed. */
export interface ResourceViewedPayload extends BaseEventPayload {
  resourceSlug: string;
}

/** Fired when a search is performed. Contains result count, NOT the query string. */
export interface SearchPerformedPayload extends BaseEventPayload {
  resultCount: number;
  hasCategory: boolean;
}

/** Union of all valid event payloads. */
export type AnalyticsEventPayload =
  | ToolOpenedPayload
  | ToolCompletedPayload
  | ToolCopiedPayload
  | ToolDownloadedPayload
  | CategoryViewedPayload
  | ResourceViewedPayload
  | SearchPerformedPayload
  | BaseEventPayload;

/**
 * A complete, fully-typed analytics event.
 * The type system makes it structurally impossible to include
 * fields like `input`, `output`, `content`, `value`, or `text`.
 */
export interface AnalyticsEvent {
  event: AnalyticsEventName;
  payload: AnalyticsEventPayload;
}
