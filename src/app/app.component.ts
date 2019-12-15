import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

    constructor(
        private idle: Idle,
        private storage: LocalStorageService,
        private http: HttpClient
    ) {
    }

    ngOnInit() {

        this.idle.onIdleStart.subscribe(e => {
            console.log('onIdleStart! Maybe warn user');
        });

        this.idle.onIdleEnd.subscribe(e => {

            console.log('onIdleEnd! Refresh token');

            const payload = new HttpParams()
                .append('grant_type', 'refresh_token')
                .append('refresh_token', this.storage.get('refresh_token'))
                .append('client_id', 'api');

            this.http.post('http://192.168.10.10:3000/oauth/access_token', payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).subscribe((response: any) => {
                this.storage.set('access_token', response.access_token);
                this.storage.set('token_type', response.token_type);
                this.storage.set('expires_in', response.expires_in);
                this.storage.set('refresh_token', response.refresh_token);
                this.storage.set('scope', response.scope);
            });
        });

        this.idle.onTimeout.subscribe(() => {
            console.log('onTimeout! Logout');
            this.storage.clearAll();
            this.idle.stop();
        });
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    }
}
