// TŘÍDY s validací proti záporným číslům
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a, _b;
var FotografickaSluzba = /** @class */ (function () {
    function FotografickaSluzba(id, nazev, zakladniSazba) {
        this.id = id;
        this.nazev = nazev;
        this.zakladniSazba = zakladniSazba;
        // kontrola pro všechny služby (akce i ateliér mají základní sazbu kterou jsem nastavil)
        if (zakladniSazba < 0)
            throw new Error('Základní sazba nesmí být záporná.');
    }
    FotografickaSluzba.prototype.getNazev = function () { return this.nazev; };
    return FotografickaSluzba;
}());
var FoceniAkce = /** @class */ (function (_super) {
    __extends(FoceniAkce, _super);
    function FoceniAkce(id, nazev, sazba, hodiny, km) {
        var _this = _super.call(this, id, nazev, sazba) || this;
        _this.hodiny = hodiny;
        _this.km = km;
        // specifická kontrola pro akci
        if (hodiny <= 0)
            throw new Error('Počet hodin musí být větší než 0.');
        if (km < 0)
            throw new Error('Počet kilometrů nesmí být záporný.');
        return _this;
    }
    FoceniAkce.prototype.spoctiCenu = function () {
        return (this.zakladniSazba * this.hodiny) + (this.km * 13);
    };
    return FoceniAkce;
}(FotografickaSluzba));
var AtelieroveFoceni = /** @class */ (function (_super) {
    __extends(AtelieroveFoceni, _super);
    function AtelieroveFoceni(id, nazev, sazba, pronajem, fotky, cenaFotka) {
        var _this = _super.call(this, id, nazev, sazba) || this;
        _this.pronajem = pronajem;
        _this.fotky = fotky;
        _this.cenaFotka = cenaFotka;
        // specifická kontrola pro ateliér
        if (pronajem < 0)
            throw new Error('Cena pronájmu nesmí být záporná.');
        if (fotky < 0)
            throw new Error('Počet fotek nesmí být záporný.');
        if (cenaFotka < 0)
            throw new Error('Cena za retuš nesmí být záporná.');
        return _this;
    }
    AtelieroveFoceni.prototype.spoctiCenu = function () {
        return this.pronajem + (this.fotky * this.cenaFotka);
    };
    return AtelieroveFoceni;
}(FotografickaSluzba));
// propojení s html
var objednavka = []; // košík
// přepínání políček podle výběru v roletce
(_a = document.getElementById('sluzba')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', function (e) {
    var jeAkce = parseInt(e.target.value) <= 2;
    document.getElementById('form-akce').style.display = jeAkce ? 'block' : 'none';
    document.getElementById('form-atelier').style.display = jeAkce ? 'none' : 'block';
});
// funkce, která obnoví košík po přidání a odebrání
function vykresliKosik() {
    var vystup = document.getElementById('vystup');
    if (objednavka.length === 0) {
        vystup.innerHTML = 'Košík je prázdný.';
        return;
    }
    var html = '';
    var celkem = 0;
    // polymorfismus
    objednavka.forEach(function (polozka, index) {
        html += "\n            <div class=\"polozka\">\n                <span>".concat(polozka.getNazev(), " - <strong>").concat(polozka.spoctiCenu(), " K\u010D</strong></span>\n                <button class=\"btn-smazat\" onclick=\"smazatPolozku(").concat(index, ")\">Odebrat</button>\n            </div>\n        ");
        celkem += polozka.spoctiCenu();
    });
    html += "<div class=\"celkem\">Celkem: ".concat(celkem, " K\u010D</div>");
    vystup.innerHTML = html;
}
// funkce pro smazání položky
window.smazatPolozku = function (index) {
    objednavka.splice(index, 1); // Odstraní 1 položku na daném indexu
    vykresliKosik(); // Znovu vykreslí košík
};
// tlačítko přidat
(_b = document.getElementById('btn-pridat')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    var idSlužby = parseInt(document.getElementById('sluzba').value);
    // katalog ts
    var data = katalog.find(function (k) { return k.id === idSlužby; });
    // ujištění zda typescript existuje
    if (!data) {
        alert("Položka nebyla nalezena v ceníku!");
        return;
    }
    // =========================
    try {
        if (idSlužby <= 2) {
            var hodiny = Number(document.getElementById('hodiny').value);
            var km = Number(document.getElementById('km').value);
            objednavka.push(new FoceniAkce(data.id, data.nazev, data.zakladniSazba, hodiny, km));
        }
        else {
            var pronajem = Number(document.getElementById('pronajem').value);
            var fotky = Number(document.getElementById('fotky').value);
            var cena = Number(document.getElementById('cena-fotka').value);
            objednavka.push(new AtelieroveFoceni(data.id, data.nazev, data.zakladniSazba, pronajem, fotky, cena));
        }
        vykresliKosik();
    }
    catch (chyba) {
        alert(chyba.message);
    }
});
