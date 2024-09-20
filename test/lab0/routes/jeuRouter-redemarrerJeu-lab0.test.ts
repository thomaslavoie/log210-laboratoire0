import request from 'supertest'; // Import SuperTest pour les requêtes HTTP
import app from '../../../src/app'; 
import 'jest-extended';

describe('GET /api/v1/jeu/redemarrerJeu', () => {
  let joueur1: any;
  let joueur2: any;

  // Cette méthode s'exécutera avant tous les tests
  beforeAll(async () => {
    // Simule la création de deux joueurs avant les tests
    joueur1 = { id: 'joueur1', nom: 'Joueur 1' };
    joueur2 = { id: 'joueur2', nom: 'Joueur 2' };

    // Créer deux joueurs (vous pouvez adapter en fonction de votre implémentation)
    await request(app).post('/api/v1/joueurs').send(joueur1);
    await request(app).post('/api/v1/joueurs').send(joueur2);
  });

  it('devrait retourner un statut 200 et un JSON pour le succès de redemarrerJeu()', async () => {
    const res = await request(app).get('/api/v1/jeu/redemarrerJeu');
  
    // Valider le code HTTP et le type de contenu JSON
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
  
    // Valider que la réponse contient le bon message
    expect(res.body).toEqual({
      message: 'Success',
      resultat: {
        message: 'Le jeu a été redémarré avec succès.',
      },
    });
  });
  
  

  // Test pour valider la postcondition du contrat d'opération (plus de joueurs)
  it('devrait vérifier qu\'il n\'y a plus de joueurs après redemarrerJeu()', async () => {
    // Appeler la route pour redémarrer le jeu
    await request(app).get('/api/v1/jeu/redemarrerJeu');
    
    // Vérifier que la liste des joueurs est vide
    const joueursRes = await request(app).get('/api/v1/joueurs');
  
    // Assurez-vous que joueursRes.body est bien un tableau et vérifiez sa taille
    expect(joueursRes.body).toEqual({}); // Attendre une liste vide
  });

   // Test pour valider que jouer retourne 404 après redemarrerJeu (aucun joueur existant)
   it('devrait retourner 404 si on essaie de jouer sans joueur après redemarrerJeu', async () => {
    // Appeler la route pour redémarrer le jeu
    await request(app).get('/api/v1/jeu/redemarrerJeu');

    // Tenter de jouer après redemarrerJeu, alors qu'il n'y a plus de joueurs
    const response = await request(app).post('/api/v1/jeu/jouer/joueur1'); // joueur1 ne devrait plus exister

    // Vérifier que la réponse retourne bien 404
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });

  
  
});
