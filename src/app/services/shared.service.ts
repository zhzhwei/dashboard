import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class SharedService {
    private resultsSource = new BehaviorSubject<string[]>([]);
    results$ = this.resultsSource.asObservable();

    updateResults(results: string[]) {
        this.resultsSource.next(results);
    }
}
