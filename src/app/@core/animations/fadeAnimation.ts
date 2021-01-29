import {
  trigger,
  animate,
  transition,
  style,
  query, sequence, group
} from '@angular/animations';

// const resetRoute = [
//   style({position: 'relative'}),
//   query(
//     ':enter, :leave',
//     [
//       style({
//         position: 'fixed', // using absolute makes the scroll get stuck in the previous page's scroll position on the new page
//         top: 0, // adjust this if you have a header so it factors in the height and not cause the router outlet to jump as it animates
//         left: 0,
//         width: '100%',
//         opacity: 0,
//       }),
//     ],
//     {optional: true}
//   ),
// ];

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', style({ opacity: 1,  position: 'fixed' }), {
      optional: true
    }),
    group([
      query(
        ':enter',
        [
          style({ opacity: 0 }),
          animate('800ms ease-in-out', style({opacity: 1, position: 'relative' , top: '0'}))
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({ opacity: 1 }),
          animate('800ms ease-in-out', style({ opacity: 0 }))
        ],
        { optional: true }
      )
    ])
  ])
]);
