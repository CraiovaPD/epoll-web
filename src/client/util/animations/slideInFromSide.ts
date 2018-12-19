import {
  style, animate, animation, AnimationReferenceMetadata
} from '@angular/animations';

export function slideInFromSide (params?: {
  time?: string,
  translatePercent?: string
}) : AnimationReferenceMetadata {
  let animationParams = Object.assign({
    time: '300ms',
    translatePercent: '50%'
  }, params || {});

  return animation([
    style({
      opacity: 0,
      transform: 'translateX({{ translatePercent }})'
    }),
    animate('{{ time }} ease-in', style({
      opacity: 1,
      transform: 'translateX(0)'
    }))
  ], {params: animationParams});
}
