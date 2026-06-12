/// <reference path="katalog.ts" />
var _a, _b;
// TŘÍDY s validací proti záporným číslům
class FotografickaSluzba {
    constructor(id, nazev, zakladniSazba) {
        this.id = id;
        this.nazev = nazev;
        this.zakladniSazba = zakladniSazba;
        // kontrola pro všechny služby (akce i ateliér mají základní sazbu kterou jsem nastavil)
        if (zakladniSazba < 0)
            throw new Error('Základní sazba nesmí být záporná.');
    }
    getNazev() { return this.nazev; }
}
class FoceniAkce extends FotografickaSluzba {
    constructor(id, nazev, sazba, hodiny, km) {
        super(id, nazev, sazba);
        this.hodiny = hodiny;
        this.km = km;
        // specifická kontrola pro akci
        if (hodiny <= 0)
            throw new Error('Počet hodin musí být větší než 0.');
        if (km < 0)
            throw new Error('Počet kilometrů nesmí být záporný.');
    }
    spoctiCenu() {
        return (this.zakladniSazba * this.hodiny) + (this.km * 13);
    }
}
class AtelieroveFoceni extends FotografickaSluzba {
    constructor(id, nazev, sazba, pronajem, fotky, cenaFotka) {
        super(id, nazev, sazba);
        this.pronajem = pronajem;
        this.fotky = fotky;
        this.cenaFotka = cenaFotka;
        // specifická kontrola pro ateliér
        if (pronajem < 0)
            throw new Error('Cena pronájmu nesmí být záporná.');
        if (fotky < 0)
            throw new Error('Počet fotek nesmí být záporný.');
        if (cenaFotka < 0)
            throw new Error('Cena za retuš nesmí být záporná.');
    }
    spoctiCenu() {
        return this.pronajem + (this.fotky * this.cenaFotka);
    }
}
// propojení s html
const objednavka = []; // košík
// přepínání políček podle výběru v roletce
(_a = document.getElementById('sluzba')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', (e) => {
    const jeAkce = parseInt(e.target.value) <= 2;
    document.getElementById('form-akce').style.display = jeAkce ? 'block' : 'none';
    document.getElementById('form-atelier').style.display = jeAkce ? 'none' : 'block';
});
// funkce, která obnoví košík po přidání a odebrání
function vykresliKosik() {
    const vystup = document.getElementById('vystup');
    if (objednavka.length === 0) {
        vystup.innerHTML = 'Košík je prázdný.';
        return;
    }
    let html = '';
    let celkem = 0;
    // polymorfismus
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
// funkce pro smazání položky
window.smazatPolozku = (index) => {
    objednavka.splice(index, 1); // odstraní 1 položku na daném indexu
    vykresliKosik(); // znovu vykreslí košík
};
// tlačítko přidat
(_b = document.getElementById('btn-pridat')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    const idSlužby = parseInt(document.getElementById('sluzba').value);
    // katalog ts
    const data = katalog.find(k => k.id === idSlužby);
    // ujištění zda typescript existuje
    if (!data) {
        alert("Položka nebyla nalezena v ceníku!");
        return;
    }
    // =========================
    try {
        if (idSlužby <= 2) {
            const hodiny = Number(document.getElementById('hodiny').value);
            const km = Number(document.getElementById('km').value);
            objednavka.push(new FoceniAkce(data.id, data.nazev, data.zakladniSazba, hodiny, km));
        }
        else {
            const pronajem = Number(document.getElementById('pronajem').value);
            const fotky = Number(document.getElementById('fotky').value);
            const cena = Number(document.getElementById('cena-fotka').value);
            objednavka.push(new AtelieroveFoceni(data.id, data.nazev, data.zakladniSazba, pronajem, fotky, cena));
        }
        vykresliKosik();
    }
    catch (chyba) {
        alert(chyba.message);
    }
});
