import { h } from 'vue';
import type { IconSet, IconProps } from 'vuetify';
import {
  mdiSkipPrevious,
  mdiPause,
  mdiPlay,
  mdiStop,
  mdiSkipNext,
  mdiVolumeHigh,
  mdiVolumeOff,
  
  mdiMagnify,
  mdiPlus,
  mdiMinus,
  mdiMusicOff,
  mdiMusic,
  mdiPencil,
  mdiDelete,
  mdiClose,
  mdiCheckboxMultipleMarked,
  mdiUpload,
  mdiFilterRemove,
  mdiMusicNote,
  mdiAccountMusic,
  mdiSort,
  mdiFormatListNumbered,
  
  mdiChevronUp,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
  mdiCheck,
  mdiCheckCircle,
  mdiInformation,
  mdiAlertCircle,
  mdiCloseCircle,
  mdiCheckboxMarked,
  mdiCheckboxBlankOutline,
  mdiMinusBox,
  mdiCircle,
  mdiArrowUp,
  mdiArrowDown,
  mdiMenu,
  mdiMenuDown,
  mdiRadioboxMarked,
  mdiRadioboxBlank,
  mdiStarOutline,
  mdiStar,
  mdiStarHalfFull,
  mdiCached,
  mdiPageFirst,
  mdiPageLast,
  mdiUnfoldMoreHorizontal,
  mdiPaperclip,
  mdiCalendar,
} from '@mdi/js';

const iconMap: Record<string, string> = {
  'mdi-skip-previous': mdiSkipPrevious,
  'mdi-pause': mdiPause,
  'mdi-play': mdiPlay,
  'mdi-stop': mdiStop,
  'mdi-skip-next': mdiSkipNext,
  'mdi-volume-high': mdiVolumeHigh,
  'mdi-volume-off': mdiVolumeOff,
  
  'mdi-magnify': mdiMagnify,
  'mdi-plus': mdiPlus,
  'mdi-minus': mdiMinus,
  'mdi-music-off': mdiMusicOff,
  'mdi-music': mdiMusic,
  'mdi-pencil': mdiPencil,
  'mdi-delete': mdiDelete,
  'mdi-close': mdiClose,
  'mdi-checkbox-multiple-marked': mdiCheckboxMultipleMarked,
  'mdi-upload': mdiUpload,
  'mdi-filter-remove': mdiFilterRemove,
  'mdi-music-note': mdiMusicNote,
  'mdi-account-music': mdiAccountMusic,
  'mdi-sort': mdiSort,
  'mdi-format-list-numbered': mdiFormatListNumbered,
  
  'mdi-chevron-up': mdiChevronUp,
  'mdi-chevron-down': mdiChevronDown,
  'mdi-chevron-left': mdiChevronLeft,
  'mdi-chevron-right': mdiChevronRight,
  'mdi-check': mdiCheck,
  'mdi-check-circle': mdiCheckCircle,
  'mdi-information': mdiInformation,
  'mdi-alert-circle': mdiAlertCircle,
  'mdi-close-circle': mdiCloseCircle,
  'mdi-checkbox-marked': mdiCheckboxMarked,
  'mdi-checkbox-blank-outline': mdiCheckboxBlankOutline,
  'mdi-minus-box': mdiMinusBox,
  'mdi-circle': mdiCircle,
  'mdi-arrow-up': mdiArrowUp,
  'mdi-arrow-down': mdiArrowDown,
  'mdi-menu': mdiMenu,
  'mdi-menu-down': mdiMenuDown,
  'mdi-radiobox-marked': mdiRadioboxMarked,
  'mdi-radiobox-blank': mdiRadioboxBlank,
  'mdi-star-outline': mdiStarOutline,
  'mdi-star': mdiStar,
  'mdi-star-half-full': mdiStarHalfFull,
  'mdi-cached': mdiCached,
  'mdi-page-first': mdiPageFirst,
  'mdi-page-last': mdiPageLast,
  'mdi-unfold-more-horizontal': mdiUnfoldMoreHorizontal,
  'mdi-paperclip': mdiPaperclip,
  'mdi-calendar': mdiCalendar,
};

const createSvgIcon = (pathData: string) => {
  return h('svg', {
    class: 'v-icon__svg',
    viewBox: '0 0 24 24',
    role: 'img',
    'aria-hidden': 'true',
    style: {
      width: '1em',
      height: '1em',
      fill: 'currentColor',
    },
  }, [
    h('path', {
      d: pathData,
    })
  ]);
};

export const mdiSvgIconSet: IconSet = {
  component: (props: IconProps) => {
    const iconName = typeof props.icon === 'string' ? props.icon : String(props.icon);
    const pathData = iconMap[iconName];
    
    if (!pathData) {
      console.warn(`Icon '${iconName}' not found in iconMap`);
      return h('span', { class: 'v-icon__svg' }, '❓');
    }
    
    return createSvgIcon(pathData);
  },
};

export const vuetifyIconAliases = {
  collapse: 'mdi-chevron-up',
  complete: 'mdi-check',
  cancel: 'mdi-close-circle',
  close: 'mdi-close',
  delete: 'mdi-close-circle',
  clear: 'mdi-close-circle',
  success: 'mdi-check-circle',
  info: 'mdi-information',
  warning: 'mdi-alert-circle',
  error: 'mdi-close-circle',
  prev: 'mdi-chevron-left',
  next: 'mdi-chevron-right',
  checkboxOn: 'mdi-checkbox-marked',
  checkboxOff: 'mdi-checkbox-blank-outline',
  checkboxIndeterminate: 'mdi-minus-box',
  delimiter: 'mdi-circle',
  sortAsc: 'mdi-arrow-up',
  sortDesc: 'mdi-arrow-down',
  expand: 'mdi-chevron-down',
  menu: 'mdi-menu',
  subgroup: 'mdi-menu-down',
  dropdown: 'mdi-menu-down',
  radioOn: 'mdi-radiobox-marked',
  radioOff: 'mdi-radiobox-blank',
  edit: 'mdi-pencil',
  ratingEmpty: 'mdi-star-outline',
  ratingFull: 'mdi-star',
  ratingHalf: 'mdi-star-half-full',
  loading: 'mdi-cached',
  first: 'mdi-page-first',
  last: 'mdi-page-last',
  unfold: 'mdi-unfold-more-horizontal',
  file: 'mdi-paperclip',
  plus: 'mdi-plus',
  minus: 'mdi-minus',
  calendar: 'mdi-calendar',
}; 
