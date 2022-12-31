import { AnnotationElement } from 'chartjs-plugin-annotation';

class AnotationData {
    public element: any;
    public lastEvent: any;
    public chart: any;
}

export const anotationData = new AnotationData();
// export const setElement = function(element: any) : any{
//     element = element;
// }

// export const setLastEvent = function(lastEvent: any) : any{
//     lastEvent = lastEvent;
// }

// export const setElement = function(element: any) : any{
//     element = element;
// };

export const drag = function(moveX: any, moveY: any) {
  

    anotationData.element.x += moveX;
    // anotationData.element.y += moveY;
    anotationData.element.x2 += moveX;
    // anotationData.element.y2 += moveY;
    anotationData.element.centerX += moveX;
    // anotationData.element.centerY += moveY;
  if (anotationData.element.elements && anotationData.element.elements.length) {
    for (const subEl of anotationData.element.elements) {
      subEl.x += moveX;
    //   subEl.y += moveY;
      subEl.x2 += moveX;
    //   subEl.y2 += moveY;
      subEl.centerX += moveX;
    //   subEl.centerY += moveY;
      subEl.bX += moveX;
    //   subEl.bY += moveY;
    }
  }
};

export const handleElementDragging = function(event: any) {
    // console.log(event.x);


  if (!anotationData.lastEvent || !anotationData.element) {
    // console.log('no');
    return false;
  }

  let x = anotationData.chart.scales['x'].getValueForPixel(anotationData.element.x);
  console.log(anotationData.chart.scales['x'].ticks[x].label);

  const moveX = event.x - anotationData.lastEvent .x;
  const moveY = event.y - anotationData.lastEvent .y;

  drag(moveX, moveY);
  anotationData.lastEvent  = event;
  return true;
};

export const handleDrag = function(event: any) : any {
    // console.log(event.type);

  if (anotationData.element) {
    // console.log(event.type);

    switch (event.type) {
    case 'mousemove':
      return handleElementDragging(event);
    case 'mouseout':
    case 'mouseup':
        anotationData.lastEvent  = undefined;
        // anotationData.element = undefined;
      break;
    case 'mousedown':    
        anotationData.lastEvent  = event;
      break;
    default:
    }
  } 
};