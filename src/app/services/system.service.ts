import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SystemService {

    public jobNames = [
        'Polymechaniker',
        'Kundenberater',
        'Qualitätsmanager',
        'Sanitärinstallateur',
        'Personalberaterin',
        'Kundendiensttechniker',
    ];

    public skillAbbr = {
        '3-Schicht-Arbeit': '3SA',
        '3D-CAD-Konstruktion': 'CAD',
        'ABACUS': 'AB',
        'Abacus': 'AB',
        'Abacus Kenntnisse': 'AB',
        'Abwechslungsreiche Arbeit': 'AA',
        'Accounting': 'AC',
        'Administration': 'AD',
        'Analytische Fähigkeiten': 'AF',
        'Analytisches Denken': 'AND',
        'Anlagen': 'A',
        'Anlagenführung': 'AF',
        'Anlagenwartung': 'AW',
        'Anpacken können': 'AK',
        'Anpassungsfähigkeit': 'APF',
        'Anstellungsbedingungen': 'ANB',
        'Applikationsmethoden in der industriellen Kunststoff-Produktion': 'AIK',
        'Arbeit mit unterstützungsbedürftigen Menschen': 'AUM',
        'Arbeitsbedingungen': 'AB',
        'Arbeitserfahrung': 'AE',
        'Arbeitsgeräte': 'AG',
        'Arbeitsgeschwindigkeit': 'AG',
        'Arbeitsorganisation': 'AO',
        'Arbeitsort': 'AO',
        'Arbeitsplatzorganisation': 'APO',
        'Arbeitsrecht': 'AR',
        'Arbeitssicherheit': 'AS',
        'Arbeitsvorbereitung': 'AV',
        'Arbeitszeitmanagement': 'AZM',
        'Attraktive Anstellungsbedingungen': 'AAB',
        'Auffassungsgabe': 'AG',
        'Auffassungsvermögen': 'AV',
        'Aufstiegsmöglichkeiten': 'AM',
        'Auftragsabwicklung': 'AA',
        'Ausbildung': 'A',
        'Ausbildung als Automatiker EFZ': 'AaA',
        'Ausbildung als Maler/in EFZ': 'AaM',
        'Ausbildung als Mechatroniker EFZ': 'AaM',
        'Ausbildung in Pflege oder FaGe': 'AiP',
        'Ausbildung zum Automobilmechatroniker': 'AzA',
        'Ausbildungsfähigkeit': 'AF',
        'Ausbildungssystem': 'AS',
        'Ausdauer': 'A',
        'Aussen- und Innendienst': 'AuI',
        'Automatikmontage': 'AM',
        'Automatisierungstechnik': 'AT',
        'Automobiltechnik': 'AMT',
        'Außendienst': 'AD',
        'BWL-Kenntnisse': 'BWL',
        'Bau': 'BAU',
        'Bauwesen': 'BW',
        'Belagsfertigung': 'BF',
        'Belastbarkeit': 'BEL',
        'Beobachtungsgenauigkeit': 'BG',
        'Beratung': 'B',
        'Bereitschaft für gelegentlichen Pikettdienst': 'BgP',
        'Bereitschaft zur Arbeit in Früh- oder Spätschichtmodellen': 'BFS',
        'Bereitschaft zur Mehrarbeit': 'BzM',
        'Bereitschaft zur Schichtarbeit': 'BzS',
        'Bereitschaft zur Überstundenarbeit': 'BzÜ',
        'Berufsausbildung': 'BA',
        'Berufsausbildung im Lebensmittelbereich': 'BiL',
        'Berufserfahrung': 'BE',
        'Berufserfahrung in der Detail- und Endmontage': 'BDE',
        'Berufserfahrung in der produzierenden Industrie': 'BpI',
        'Betreuung': 'BET',
        'Betriebsunterhalt': 'BU',
        'Betriebswirtschaftliche Fähigkeiten': 'BWF',
        'Betriebswirtschaftliche Kenntnisse': 'BWK',
        'Betriebswirtschaftliches Denken': 'BWD',
        'Betriebswirtschaftslehre': 'BWL',
        'Bewerbungsmanagement': 'BM',
        'Beziehungsmanagement': 'BZM',
        'Bilanzierung': 'BIL',
        'Branchenkenntnisse Heizung': 'BKH',
        'Buchhaltung': 'BH',
        'Bäckerei': 'BÄ',
        'CAD': 'CAD',
        'CAD-Kenntnisse': 'CAD',
        'CAD-Programme': 'CAD',
        'CNC-Fertigung': 'CNC',
        'CNC-Maschinen bedienen': 'CNC',
        'CNC-Programmierung': 'CNC',
        'CNC-Schleifen': 'CNC',
        'CNC-Steuerungen': 'CNC',
        'Chemie- und Pharmatechnologe': 'CuP',
        'Chemikant': 'CHE',
        'Chromstahl': 'CS',
        'Computerkenntnisse': 'CK',
        'Content-Erstellung': 'CE',
        'Controlling': 'C',
        'Datenanalyse': 'DA',
        'Datenbanken': 'DB',
        'Deutsch': 'DEU',
        'Deutschkenntnisse': 'DEU',
        'Deutschkenntnisse auf muttersprachlichem Niveau': 'DmN',
        'Deutschkenntnisse in Wort und Schrift': 'DWS',
        'Diagnose': 'DIA',
        'Diagnose von Fahrzeugproblemen': 'DvF',
        'Diagnosefähigkeit': 'DF',
        'Dienstleistungsorientierung': 'DLO',
        'Digitale Kompetenz': 'DK',
        'Digitale Tools': 'DT',
        'Diskretion': 'DIS',
        'Dispositionserfahrung': 'DPE',
        'Dokumentation von Patienteninformationen': 'DPI',
        'Drehen': 'D',
    };
}