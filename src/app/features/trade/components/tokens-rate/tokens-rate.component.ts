import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import { SwapsFormService } from '@features/trade/services/swaps-form/swaps-form.service';

interface TokenRate {
  amount: BigNumber;
  symbol: string;
}

interface TokensRate {
  from: TokenRate;
  to: TokenRate;
}

@Component({
  selector: 'app-tokens-rate',
  templateUrl: './tokens-rate.component.html',
  styleUrls: ['./tokens-rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokensRateComponent implements OnInit {
  public tokensRate$: Observable<TokensRate>;

  public rateDirection: 'from' | 'to' = 'from';

  constructor(private readonly swapFormService: SwapsFormService) {}

  ngOnInit() {
    this.tokensRate$ = combineLatest([
      this.swapFormService.inputValueDistinct$,
      this.swapFormService.outputValueDistinct$
    ]).pipe(
      map(([inputForm, outputForm]) => {
        const { fromAmount, fromToken, toToken } = inputForm;
        const { toAmount } = outputForm;
        if (toAmount?.gt(0) && fromAmount?.actualValue.gt(0) && fromToken && toToken) {
          return {
            from: {
              amount: fromAmount.actualValue.dividedBy(toAmount),
              symbol: fromToken.symbol
            },
            to: {
              amount: toAmount.dividedBy(fromAmount.actualValue),
              symbol: toToken.symbol
            }
          };
        }

        return null;
      })
    );
  }

  public onChangeDirection(): void {
    this.rateDirection = this.rateDirection === 'from' ? 'to' : 'from';
  }
}
