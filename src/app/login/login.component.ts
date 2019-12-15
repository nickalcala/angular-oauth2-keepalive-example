import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    oauthResponse: any;
    account: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private storage: LocalStorageService,
        private idle: Idle,
        private http: HttpClient
    ) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.code) {
                this.getAccessToken(params.code);
            }
        });
    }

    getAccessToken(code: string) {

        const payload = new HttpParams()
            .append('grant_type', 'authorization_code')
            .append('code', code)
            .append('redirect_uri', 'http://localhost:4200/oauth/callback')
            .append('client_id', 'api');

        this.http.post('http://192.168.10.10:3000/oauth/access_token', payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).subscribe((response: any) => {
            this.oauthResponse = response;
            this.storage.set('access_token', response.access_token);
            this.storage.set('token_type', response.token_type);
            this.storage.set('expires_in', response.expires_in);
            this.storage.set('refresh_token', response.refresh_token);
            this.storage.set('scope', response.scope);

            this.idle.setIdle(response.expires_in);
            this.idle.setTimeout(10); // Timeout 10 seconds after being idle

            // Start
            this.idle.watch();
        });
    }

    goToLoginPage() {
        const params = [
            'response_type=code',
            'state=1234',
            'client_id=api',
            'scope=example',
            encodeURIComponent('redirect_uri=http://localhost:4200/oauth/callback'),
        ];

        window.location.href = 'http://192.168.10.10:3000/oauth/authenticate?' + params.join('&');
    }

    getProfile() {
        this.http.get('http://192.168.10.10:3000/account', {
            headers: {
                Authorization: 'Bearer ' + this.oauthResponse.access_token
            }
        }).subscribe(response => {
            this.account = response;
        });
    }

}
