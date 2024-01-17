import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RdfDataService {
    public prefixes = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX edm: <http://ai4bd.com/resource/edm/>
        PREFIX mp: <http://ai4bd.com/resource/ddm/mp/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    `;
    
    private endpointUrl = 'https://graphdb.elevait.io/repositories/student-project';
    private headers = new HttpHeaders({
        Authorization: 'Basic ' + btoa('kp-student-project:2LhW6HaUYqVTgLTWhcW2')
    });

    constructor(private http: HttpClient) {}

    public getQueryResults(query): Promise<any> {

    //     const options = {
    //         headers: this.headers,
    //         params: {
    //             query: query
    //         }
    //     };

    //     return this.http.get(this.endpointUrl, options)
    //         .toPromise()
    //         .then(response => response)
    //         .catch(error => console.error(error)); 
    return undefined
    }
   
}