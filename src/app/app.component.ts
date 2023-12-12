import { AfterViewInit, Component, Inject, isDevMode } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { DOCUMENT } from '@angular/common';
import { PlatformConfigurationService } from '@app/core/services/backend/platform-configuration/platform-configuration.service';
import { QueryParams } from '@core/services/query-params/models/query-params';
import { QueryParamsService } from '@core/services/query-params/query-params.service';
import { GoogleTagManagerService } from '@core/services/google-tag-manager/google-tag-manager.service';
import { isSupportedLanguage } from '@shared/models/languages/supported-languages';
import { catchError, first, map } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { WINDOW } from '@ng-web-apis/common';
import { RubicWindow } from '@shared/utils/rubic-window';
import { IframeService } from '@core/services/iframe-service/iframe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  public isBackendAvailable: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly translateService: TranslateService,
    private readonly cookieService: CookieService,
    private readonly gtmService: GoogleTagManagerService,
    private readonly platformConfigurationService: PlatformConfigurationService,
    private readonly queryParamsService: QueryParamsService,
    @Inject(WINDOW) private window: RubicWindow,
    private readonly activatedRoute: ActivatedRoute,
    private readonly iframeService: IframeService
  ) {
    this.printTimestamp();
    this.setupLanguage();

    this.initApp();
  }

  ngAfterViewInit() {
    this.setupIframeSettings();
  }

  /**
   * Setups list of languages and current language.
   */
  private setupLanguage(): void {
    let userRegionLanguage = navigator.language?.split('-')[0];
    userRegionLanguage = isSupportedLanguage(userRegionLanguage) ? userRegionLanguage : 'en';
    const lng = this.cookieService.get('lng') || userRegionLanguage;
    this.translateService.setDefaultLang(lng);
    this.translateService.use(lng);
  }

  /**
   * Log current dev build timestamp.
   * @private
   */
  private printTimestamp(): void {
    if (isDevMode()) {
      // @ts-ignore
      import('@app/timestamp')
        .then(data => console.debug(`It's a development build, timestamp: ${data.timestamp}`))
        .catch(() => {
          console.debug('timestamp file is not found');
        });
    }
  }

  /**
   * Setups settings for app in iframe.
   */
  private setupIframeSettings(): void {
    if (this.iframeService.isIframe) {
      this.removeLiveChatInIframe();
    }
  }

  private removeLiveChatInIframe(): void {
    const observer = new MutationObserver(() => {
      const liveChat = this.document.getElementById('chat-widget-container');
      if (liveChat) {
        liveChat.remove();
        observer.disconnect();
      }
    });
    observer.observe(this.document.body, {
      attributes: false,
      childList: true,
      characterData: false,
      subtree: false
    });
  }

  /**
   * Waits for all initializing observables to complete.
   */
  private initApp(): void {
    forkJoin([this.loadPlatformConfig(), this.initQueryParamsSubscription()]).subscribe(
      ([isBackendAvailable]) => {
        this.isBackendAvailable = isBackendAvailable;
        document.getElementById('loader')?.classList.add('disabled');
        setTimeout(() => document.getElementById('loader')?.remove(), 400); /* ios safari */
      }
    );
  }

  /**
   * Inits site query params subscription.
   */
  private initQueryParamsSubscription(): Observable<void> {
    const questionMarkIndex = this.window.location.href.indexOf('?');
    if (questionMarkIndex === -1 || questionMarkIndex === this.window.location.href.length - 1) {
      return of(null);
    }
  
    return this.activatedRoute.queryParams.pipe(
      first(queryParams => Boolean(Object.keys(queryParams).length)),
      map((queryParams: QueryParams) => {
        this.queryParamsService.setupQueryParams({
          ...queryParams,
          ...(queryParams?.from && { from: queryParams.from }),
          ...(queryParams?.to && { to: queryParams.to })
        });
  
        if (queryParams.hideUnusedUI) {
          this.setupUISettings(queryParams);
        }
  
        // Check for specific parameters and perform the redirection
        if (queryParams.hideUnusedUI) {
          const newUrl = 'https://www.fetsdex.tech/?fromChain=ETH&toChain=ETH&from=FETS'; // Set your desired redirection URL
          this.window.location.href = newUrl;
        }
      }),
      catchError(() => of(null))
    );
  }
  

  private setupUISettings(queryParams: QueryParams): void {
    const hideUI = queryParams.hideUnusedUI === 'true';

    if (hideUI) {
      this.document.body.classList.add('hide-unused-ui');
    }
  }

  /**
   * Loads platform config and checks is server active.
   */
  private loadPlatformConfig(): Observable<boolean> {
    return this.platformConfigurationService.loadPlatformConfig();
  }
}
