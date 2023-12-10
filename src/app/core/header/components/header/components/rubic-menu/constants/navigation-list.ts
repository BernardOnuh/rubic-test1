import { NavigationItem } from '@core/header/components/header/components/rubic-menu/models/navigation-item';
import { EXTERNAL_LINKS, ROUTE_PATH } from '@shared/constants/common/links';

const defaultSrc = 'assets/images/icons/navigation/';

type Section = 'Trade'  | 'Social';

export const NAVIGATION_LIST = [
  {
    translateKey: 'Token Claim',
    type: 'external',
    link: EXTERNAL_LINKS.AIRDROP,
    imagePath: `assets/images/rbc.svg`
  },
  {
    translateKey: 'navigation.sdk',
    type: 'external',
    link: EXTERNAL_LINKS.LANDING_SDK,
    imagePath: `${defaultSrc}sdk.svg`
  },
  {
    translateKey: 'navigation.setupWidget',
    type: 'external',
    link: EXTERNAL_LINKS.LANDING_SETUP_WIDGET,
    imagePath: `${defaultSrc}widget.svg`
  },
  {
    translateKey: 'navigation.faq',
    type: 'internal',
    link: 'faq',
    imagePath: `${defaultSrc}faq.svg`
  },
  {
    translateKey: 'navigation.about',
    type: 'external',
    link: EXTERNAL_LINKS.LANDING,
    imagePath: `${defaultSrc}team.svg`
  },
  {
    translateKey: 'navigation.retrodrop',
    type: 'internal',
    link: 'retrodrop',
    target: '_self',
    imagePath: `${defaultSrc}retrodrop.svg`
  },
  {
    translateKey: 'Testnet App',
    type: 'external',
    link: EXTERNAL_LINKS.TESTNET_APP,
    imagePath: `${defaultSrc}test.svg`
  }
] as NavigationItem[];

export const MOBILE_NAVIGATION_LIST: { [key in Section]: NavigationItem[] } = {
  ['Trade']: [
    {
      translateKey: 'Swap',
      type: 'internal',
      link: ROUTE_PATH.NONE,
      active: false
    },
    /*{
      translateKey: 'Staking',
      type: 'internal',
      link: ROUTE_PATH.STAKING,
      active: false
    },
    {
      translateKey: 'Limit Order',
      type: 'internal',
      link: ROUTE_PATH.LIMIT_ORDER,
      active: false
    },
    {
      translateKey: 'Swap to Earn',
      type: 'internal',
      link: ROUTE_PATH.AIRDROP,
      active: false
    },
    {
      translateKey: 'Retrodrop',
      type: 'internal',
      link: ROUTE_PATH.RETRODROP,
      active: false
    },
    {
      translateKey: 'Revoke Approval',
      type: 'internal',
      link: ROUTE_PATH.REVOKE_APPROVAL,
      active: false
    },
    {
      translateKey: 'ChangeNow Tx',
      type: 'internal',
      link: ROUTE_PATH.CHANGENOW_RECENT_TRADES,
      active: false
    }*/
  ],
  ['Social']: [
    {
      translateKey: 'Twitter',
      type: 'external',
      link: 'https://twitter.com/fetsedgetech'
    },
    {
      translateKey: 'Telegram',
      type: 'external',
      link: 'https://t.me/FETechnologies'
    },
    {
      translateKey: 'Discord',
      type: 'external',
      link: 'https://discord.com/invite/UvMnZtUWvY'
    },
    {
      translateKey: 'Coinmarketcap',
      type: 'external',
      link: 'https://coinmarketcap.com/currencies/fets'
    },
    {
      translateKey: 'Coingecko',
      type: 'external',
      link: 'https://www.geckoterminal.com/eth/pools/0x5a424aba0e5400d90eb88abaa790fefed54c62c7?utm_source=coingecko&utm_medium=referral&utm_campaign=searchresults'
    }
  ],
};
