import 'jest-extended';
import { JeuDeDes } from '../../../src/core/jeuDeDes';

describe('JeuDeDesTest', () => {
  let jdd: JeuDeDes;
  beforeEach(async () => {
    jdd = new JeuDeDes();
  });

  it(`devrait n'avoir aucun joueur au début`, async () => {
    expect(jdd.joueurs).toEqual("[]")
  })

  it('devrait retourner une valeur entre 3 et 18', () => {
    for (let i = 0; i < 200; i++) {
      expect(jdd.brasser()).toBeWithin(3, 19);  // Inclusif pour 3 à 18 (19 exclus)
    }
  });

  it('devrait retourner finalement toutes les valeurs entre 3 et 18', () => {
    const resultats = new Set();
    for (let i = 0; i < 1000; i++) {
      resultats.add(jdd.brasser());
    }
    expect(resultats.size).toBe(16);  // Il n'y a que 16 valeurs possibles entre 3 et 18
    for (let i = 3; i <= 18; i++) {   // Parcourir les valeurs de 3 à 18
      expect(resultats.has(i)).toBeTrue();
    }
    // cas particuliers
    expect(resultats.has(2)).toBeFalsy();  // Il ne devrait pas y avoir de valeur inférieure à 3
    expect(resultats.has(19)).toBeFalsy();  // Il ne devrait pas y avoir de valeur supérieure à 18
  });
  

});
