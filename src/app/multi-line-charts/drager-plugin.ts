import * as Utils from './utils'
export const dragger = {
    id: 'dragger',
    beforeEvent(chart: any, args: any, options: any) {
      if (Utils.handleDrag(args.event)) {
        args.changed = true;
        return;
      }
    }
  };