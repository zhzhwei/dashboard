import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RdfDataService {
    private endpointUrl = 'https://graphdb.elevait.io/repositories/student-project';
    private headers = new HttpHeaders({
        Authorization: 'Basic ' + btoa('kp-student-project:2LhW6HaUYqVTgLTWhcW2')
    });

    constructor(private http: HttpClient) {}

    public queryData(query): Promise<any> {

        const options = {
            headers: this.headers,
            params: {
                query: query
            }
        };

        return this.http.get(this.endpointUrl, options)
            .toPromise()
            .then(response => response)
            .catch(error => console.error(error));
    }
}