import 'jest-extended';
import { readFileSync } from 'fs';
const path = require('path');

let content = ""
beforeAll(async () => {
  const filename = path.join('test', 'lab0', 'routes', 'jeuRouter-redemarrerJeu-lab0.test.ts');
  content = readFileSync(filename, 'utf-8');
});

describe('redemarrerJeu.test.ts', () => {
  it("should contain \"get('/api/v1/jeu/redemarrerJeu')\"", () => {
    expect(content.includes("get('/api/v1/jeu/redemarrerJeu')")).toBeTruthy();
  });

  /*
  * Après un redémarrage, il n'y a plus de joueurs. 
  * Il doit donc être impossible de jouer une partie sans joueur. 
  * Il faut donc tester que l'application retourne bien une erreur HTTP 404 dans le cas où on tente de jouer une partie, 
  * en spécifiant ou pas un nom du joueur (qui n'existerait pas dans le système)
  */
  it("devrait contenir un test pour jouer qui retourne 404 (après redemarrerJeu())", () => {
    expect(content.includes("/api/v1/jeu/jouer/")).toBeTruthy();
    expect(content.includes(".status).toBe(404)")).toBeTruthy();
  });
});
