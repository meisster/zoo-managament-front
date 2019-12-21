import {animate, query, style, transition, trigger} from '@angular/animations';

export const fadeInAnimation =
  trigger('routeAnimations', [
    transition('* <=> *', [
      style({opacity: '1'}),
      query(':enter, :leave', [
        style({
          opacity: 0
        })
      ]),
      query(':enter', [
        animate('600ms ease out',
          style({opacity: 1})
        )
      ])
    ])
  ]);
