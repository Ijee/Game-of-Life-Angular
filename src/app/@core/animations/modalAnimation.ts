import {
  trigger,
  animate,
  transition,
  style,
  query,
  group
} from '@angular/animations';

export const modalAnimation = trigger('modalAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [style({ opacity: 0 })],
      { optional: true }
    ),
    group([
      query(
        ':leave',
        [style({ opacity: 1 }), animate('0.5s ease-out', style({ opacity: 0 }))],
        { optional: true }
      ),
      query(
        ':enter',
        [style({ opacity: 0 }), animate('0.5s ease-in', style({ opacity: 1 }))],
        { optional: true }
      )
    ])
  ])
]);
