
import { katalog } from './katalog.js';

// ==========================================
// 1. ČÁST: OOP ARCHITEKTURA (TŘÍDY)
// ==========================================

abstract class FotografickaSluzba {
    protected readonly id: number;
    protected nazev: string;
    protected zakladniSazba: number;

    constructor(id: number, nazev: string, sazba: number) {
        if (nazev.trim() === '') throw new Error('Název nesmí být prázdný.');
        if (sazba < 0) throw new Error('Sazba nesmí být záporná.');
        
        this.id = id;
        this.nazev = nazev;
        this.zakladniSazba = sazba;
    }

    abstract spoctiCenu(): number;

    public popisPolozky(): string {
        return `<strong>${this.nazev}</strong> <br> Cena: ${this.spoctiCenu()} Kč`;
    }
}

class FoceniAkce extends FotografickaSluzba {
    private pocetHodin: number;
    private vzdalenostKm: number;
    private readonly sazbaZaKm: number = 6.50;

    constructor(id: number, nazev: string, sazba: number, hodiny: number, km: number) {
        super(id, nazev, sazba);
        if (hodiny <= 0) throw new Error('Počet hodin musí být > 0.');
        if (km < 0) throw new Error('Vzdálenost nesmí být záporná.');
        
        this.pocetHodin = hodiny;
        this.vzdalenostKm = km;
    }

    public spoctiCenu(): number {
        const honorar = this.zakladniSazba * this.pocetHodin;
        const cestovne = this.vzdalenostKm * this.sazbaZaKm * 2;
        return Math.round(honorar + cestovne);
    }
}

class AtelieroveFoceni extends FotografickaSluzba {
    private pronajem: number;
    private pocetFotek: number;
    private cenaZaFotku: number;

    constructor(id: number, nazev: string, sazba: number, pronajem: number, fotky: number, cenaFotka: number) {
        super(id, nazev, sazba);
        if (pronajem < 0 || fotky <= 0 || cenaFotka < 0) {
            throw new Error('Neplatné hodnoty pro ateliér.');
        }
        
        this.pronajem = pronajem;
        this.pocetFotek = fotky;
        this.cenaZaFotku = cenaFotka;
    }

    public spoctiCenu(): number {
        return Math.round(this.pronajem + (this.pocetFotek * this.cenaZaFotku));
    }
}

// ==========================================
// 2. ČÁST: PROPOJENÍ S HTML A TESTOVÁNÍ
// ==========================================

// Simulace: Výběr dat z katalogu
const dataSvatba = katalog.find(p => p.id === 1)!;
const dataProdukt = katalog.find(p => p.id === 4)!;

const objednavka: FotografickaSluzba[] = [];

try {
    // Vytvoření instancí
    objednavka.push(new FoceniAkce(dataSvatba.id, dataSvatba.nazev, dataSvatba.zakladniSazba, 10, 30));
    objednavka.push(new AtelieroveFoceni(dataProdukt.id, dataProdukt.nazev, dataProdukt.zakladniSazba, 2000, 25, 150));
} catch (e: any) {
    console.error(e.message);
}

// Najdeme si DIV v HTML stránce, kam budeme zapisovat
const divVystup = document.getElementById('vystup');

if (divVystup) {
    divVystup.innerHTML = ''; // Vymažeme text "Načítám data..."
    let celkovaCena = 0;

    // Projdeme pole a vypíšeme každou položku do HTML
    objednavka.forEach(polozka => {
        const polozkaHTML = document.createElement('div');
        polozkaHTML.className = 'polozka';
        polozkaHTML.innerHTML = polozka.popisPolozky(); // Zavolá se metoda ze třídy
        divVystup.appendChild(polozkaHTML);

        celkovaCena += polozka.spoctiCenu(); // Polymorfismus v praxi!
    });

    // Přidáme celkový součet na konec
    const celkemHTML = document.createElement('div');
    celkemHTML.className = 'celkem';
    celkemHTML.innerHTML = `Celková částka k úhradě: ${celkovaCena} Kč`;
    divVystup.appendChild(celkemHTML);
}