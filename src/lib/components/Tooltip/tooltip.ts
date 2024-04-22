import { createPopper } from '@popperjs/core';

import type { Instance, OptionsGeneric, Modifier } from '@popperjs/core';

export type PopperOptions<TModifier> = Partial<OptionsGeneric<TModifier>> | undefined;

export type ReferenceAction = (node: HTMLElement, handlers: any) => { destroy(): void };

export type ContentAction<TModifier> = (
  node: HTMLElement,
  popperOptions?: PopperOptions<TModifier>
) => {
  update(popperOptions: PopperOptions<TModifier>): void;
  destroy(): void;
};

export function createPopperActions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TModifier extends Partial<Modifier<any, any>>
>(
  initOptions?: PopperOptions<TModifier>
): [ReferenceAction, ContentAction<TModifier>, () => Instance | null] {
  let popperInstance: Instance | null = null;
  let referenceNode: HTMLElement;
  let referenceHandlers: any = null;
  let contentNode: HTMLElement;
  let options: PopperOptions<TModifier> | undefined = initOptions;

  const initPopper = () => {
    if (referenceNode && contentNode) {
      popperInstance = createPopper(referenceNode, contentNode, options);
    }
  };

  const destroyPopper = () => {
    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = null;
    }
  };

  const addReferenceEvents = (node: HTMLElement, handlers: any) => {
    if (node && handlers) {
      node.style.cursor = 'pointer';
      node.addEventListener('mouseenter', handlers.onMouseEnter);
      node.addEventListener('mouseleave', handlers.onMouseLeave);
    }
  };

  const removeReferenceEvents = (node: HTMLElement, handlers: any) => {
    if (node && handlers) {
      node.style.cursor = 'auto';
      node.removeEventListener('mouseenter', handlers.onMouseEnter);
      node.removeEventListener('mouseleave', handlers.onMouseLeave);
    }
  };

  const referenceAction: ReferenceAction = (node, handlers) => {
    referenceHandlers = handlers;
    referenceNode = node;

    addReferenceEvents(node, handlers);
    initPopper();
    return {
      destroy() {
        destroyPopper();
        removeReferenceEvents(referenceNode, referenceHandlers);
      },
    };
  };

  const contentAction: ContentAction<TModifier> = (node, contentOptions?) => {
    contentNode = node;
    options = { ...initOptions, ...contentOptions };
    initPopper();
    return {
      update(newContentOptions: PopperOptions<TModifier>) {
        options = { ...initOptions, ...newContentOptions };
        if (popperInstance && options) {
          popperInstance.setOptions(options);
        }
      },
      destroy() {
        destroyPopper();
      },
    };
  };

  return [referenceAction, contentAction, () => popperInstance];
}
