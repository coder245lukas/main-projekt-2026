// TŘÍDY s validací proti záporným číslům

abstract class FotografickaSluzba {
    constructor(protected id: number, protected nazev: string, protected zakladniSazba: number) {
        // kontrola pro všechny služby (akce i ateliér mají základní sazbu kterou jsem nastavil)
        if (zakladniSazba < 0) throw new Error('Základní sazba nesmí být záporná.');
    }
    abstract spoctiCenu(): number;
    public getNazev(): string { return this.nazev; }
}

class FoceniAkce extends FotografickaSluzba {
    constructor(id: number, nazev: string, sazba: number, private hodiny: number, private km: number) {
        super(id, nazev, sazba);
        
        // specifická kontrola pro akci
        if (hodiny <= 0) throw new Error('Počet hodin musí být větší než 0.');
        if (km < 0) throw new Error('Počet kilometrů nesmí být záporný.');
    }
    
    spoctiCenu() { 
        return (this.zakladniSazba * this.hodiny) + (this.km * 13); 
    }
}

class AtelieroveFoceni extends FotografickaSluzba {
    constructor(id: number, nazev: string, sazba: number, private pronajem: number, private fotky: number, private cenaFotka: number) {
        super(id, nazev, sazba);
        
        // specifická kontrola pro ateliér
        if (pronajem < 0) throw new Error('Cena pronájmu nesmí být záporná.');
        if (fotky < 0) throw new Error('Počet fotek nesmí být záporný.');
        if (cenaFotka < 0) throw new Error('Cena za retuš nesmí být záporná.');
    }
    
    spoctiCenu() { 
        return this.pronajem + (this.fotky * this.cenaFotka); 
    }
}

// propojení s html
const objednavka: FotografickaSluzba[] = []; // košík

// Přepínání políček podle výběru v roletce (ID 1 a 2 jsou Akce, zbytek Ateliér)
document.getElementById('sluzba')?.addEventListener('change', (e) => {
    const jeAkce = parseInt((e.target as HTMLSelectElement).value) <= 2;
    document.getElementById('form-akce')!.style.display = jeAkce ? 'block' : 'none';
    document.getElementById('form-atelier')!.style.display = jeAkce ? 'none' : 'block';
});

// Funkce, která překreslí košík (volá se po přidání i po smazání)
function vykresliKosik() {
    const vystup = document.getElementById('vystup')!;
    if (objednavka.length === 0) {
        vystup.innerHTML = 'Košík je prázdný.';
        return;
    }

    let html = '';
    let celkem = 0;

    // Cyklus projde všechny položky (Polymorfismus)
    objednavka.forEach((polozka, index) => {
        html += `
            <div class="polozka">
                <span>${polozka.getNazev()} - <strong>${polozka.spoctiCenu()} Kč</strong></span>
                <button class="btn-smazat" onclick="smazatPolozku(${index})">Odebrat</button>
            </div>
        `;
        celkem += polozka.spoctiCenu();
    });

    html += `<div class="celkem">Celkem: ${celkem} Kč</div>`;
    vystup.innerHTML = html;
}

// Globální funkce pro smazání položky (musí být na window, aby šla zavolat z HTML)
(window as any).smazatPolozku = (index: number) => {
    objednavka.splice(index, 1); // Odstraní 1 položku na daném indexu
    vykresliKosik(); // Znovu vykreslí košík
};

// Kliknutí na tlačítko PŘIDAT
document.getElementById('btn-pridat')?.addEventListener('click', () => {
    const idSlužby = parseInt((document.getElementById('sluzba') as HTMLSelectElement).value);
    
    // katalog ts
    const data = katalog.find(k => k.id === idSlužby);

    // Ujistíme TypeScript, že data existují, než z nich začneme tahat id, nazev atd.
    if (!data) {
        alert("Položka nebyla nalezena v ceníku!");
        return; 
    }
    // =========================

    try {
        if (idSlužby <= 2) {
            const hodiny = Number((document.getElementById('hodiny') as HTMLInputElement).value);
            const km = Number((document.getElementById('km') as HTMLInputElement).value);
            // Nyní už data.id, data.nazev a data.zakladniSazba nesvítí červeně
            objednavka.push(new FoceniAkce(data.id, data.nazev, data.zakladniSazba, hodiny, km));
        } else {
            const pronajem = Number((document.getElementById('pronajem') as HTMLInputElement).value);
            const fotky = Number((document.getElementById('fotky') as HTMLInputElement).value);
            const cena = Number((document.getElementById('cena-fotka') as HTMLInputElement).value);
            objednavka.push(new AtelieroveFoceni(data.id, data.nazev, data.zakladniSazba, pronajem, fotky, cena));
        }
        vykresliKosik(); 
    } catch (chyba: any) {
        alert(chyba.message); 
    }
});