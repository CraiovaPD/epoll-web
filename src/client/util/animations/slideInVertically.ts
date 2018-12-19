import {
  style, animate, animation
} from '@angular/animations';

export function slideInVertically (params?: {
  time?: string,
  translatePercent?: string
}) {
  let animationParams = Object.assign({
    time: '300ms',
    translatePercent: '50%'
  }, params || {});

  return animation([
    style({
      opacity: 0,
      transform: 'translateY({{ translatePercent }})'
    }),
    animate('{{ time }} ease-in', style({
      opacity: 1,
      transform: 'translateX(0)'
    }))
  ], {params: animationParams});
}
