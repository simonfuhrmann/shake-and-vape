import {css} from 'lit';

export const sharedStyles = css`
  :host {
    --bg-color-1: #ffffff;
    --bg-color-2: #f9fafb;
    --bg-color-3: #eceff1;

    --fg-color-1: #000;
    --fg-color-2: #333;
    --fg-color-3: #555;

    --fg-color-disabled: #666;
    --fg-color-error: #f00;
    --fg-color-success: #0f0;

    --separator-color: #999;

    --bg-color-button: #1a73e8;
    --fg-color-button: white;

    --diy-toolbar-bg-color: #424b4b;
    --diy-toolbar-fg-color: white;
    --diy-toolbar-height: 56px;

    --default-box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

    --default-content-width: 690px;

    --oxy-scrollbar-width: 12px;
    --oxy-scrollbar-track-color: transparent;
    --oxy-scrollbar-track-border-radius: 0;
    --oxy-scrollbar-thumb-color: transparent;
    --oxy-scrollbar-thumb-border: 1px solid transparent;
    --oxy-scrollbar-thumb-border-radius: 3px;
    --oxy-scrollbar-thumb-box-shadow:
        inset 0 0 0 var(--oxy-scrollbar-width) var(--fg-color-disabled);
    --oxy-scrollbar-thumb-hover-color: transparent;
    --oxy-scrollbar-thumb-hover-box-shadow:
        inset 0 0 0 var(--oxy-scrollbar-width) var(--fg-color-3);
  }

  oxy-button[raised] {
    background-color: var(--bg-color-button);
    color: var(--fg-color-button);
    box-shadow: var(--default-box-shadow);
  }
  oxy-button:not([raised]) {
    text-transform: uppercase;
  }
  oxy-button > oxy-icon:not(:last-child) {
    margin-right: 8px;
  }

  oxy-dialog {
    --oxy-dialog-background: var(--bg-color-3);
  }
  oxy-dialog > .content {
    margin: 0 16px;
  }

  oxy-input {
    --oxy-input-background: var(--bg-color-1);
    --oxy-input-border-focused: 1px solid var(--separator-color);
  }

  .paper-card {
    background-color: var(--bg-color-3);
    box-shadow: var(--default-box-shadow);
    padding: 16px;
  }
  .paper-card > .buttons {
    margin: 8px 0 0 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .paper-card > h2 {
      margin: 8px 0 16px 0;
  }

  .scrollable::-webkit-scrollbar {
    width: var(--oxy-scrollbar-width);
  }
  .scrollable::-webkit-scrollbar-track {
    background: var(--oxy-scrollbar-track-color);
    border-radius: var(--oxy-scrollbar-track-border-radius);
  }
  .scrollable::-webkit-scrollbar-thumb {
    background: var(--oxy-scrollbar-thumb-color);
    border: var(--oxy-scrollbar-thumb-border);
    border-radius: var(--oxy-scrollbar-thumb-border-radius);
    box-shadow: var(--oxy-scrollbar-thumb-box-shadow);
  }
  .scrollable::-webkit-scrollbar-thumb:hover {
    background: var(--oxy-scrollbar-thumb-hover-color);
    box-shadow: var(--oxy-scrollbar-thumb-hover-box-shadow);
  }

  [hidden] {
    display: none !important;
  }
`;
