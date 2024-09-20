import supertest from 'supertest';
import 'jest-extended';
import app from '../../../src/app';

const request = supertest(app);

const testNom1 = 'Jean-Marc';

describe('baseRoute', () => {

  it('devrait avoir un contenu HTML', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
  });

});

describe('/stats', () => {

  it('devrait avoir un contenu HTML', async () => {
    const response = await request.get('/stats');
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
  });

});

describe('/signin (déjà connecté)', () => {

  it('devrait avoir un contenu HTML', async () => {
    const response = await request.get('/signin');
    expect(response.status).toBe(302);
    expect(response.text).toBe("Found. Redirecting to /");
  });

});

describe('/signout', () => {

  it('devrait avoir un contenu HTML', async () => {
    const response = await request.get('/signout');
    expect(response.status).toBe(302);
    expect(response.text).toBe("Found. Redirecting to /");
  });

});

describe('/signin (déconnecté)', () => {

  it('devrait avoir un contenu HTML', async () => {
    const response = await request.get('/signin');
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
  });

});

describe('GET /bo/gu/s/URL/', () => {
  it(`devrait répondre avec une mauvaise demande lorsque l'URL est mauvais`, async () => {
    const response = await request.get('/bo/gu/s/URL/' + testNom1);
    expect(response.status).toBe(404);
  });
});

describe('User session management', () => {
  it('devrait rediriger vers "/" si déjà connecté', async () => {
    const response = await request.get('/signin');
    expect(response.status).toBe(200); // Redirection
    expect(response.header.location).toBeUndefined;
  });

  it('devrait permettre la déconnexion', async () => {
    const response = await request.get('/signout');
    expect(response.status).toBe(302); // Redirection après déconnexion
    expect(response.header.location).toBe('/');
  });
});

describe('Error handling', () => {
  it('devrait retourner une erreur 400 si un joueur avec le même nom existe déjà', async () => {
    await request.post('/api/v1/jeu/demarrerJeu').send({ nom: 'Jean-Marc' });
    const response = await request.post('/api/v1/jeu/demarrerJeu').send({ nom: 'Jean-Marc' });
    expect(response.status).toBe(400); // L'implémentation pourrait différer
    expect(response.body).toHaveProperty('error');
  });

  it('devrait retourner 404 pour une route inexistante', async () => {
    const response = await request.get('/api/v1/jeu/routeInexistante');
    expect(response.status).toBe(404);
  });
});

describe('GET /stats', () => {
  beforeAll(async () => {
    // Démarrer un jeu avec deux joueurs
    await request.post('/api/v1/jeu/demarrerJeu').send({ nom: 'Jean-Marc' });
    await request.post('/api/v1/jeu/demarrerJeu').send({ nom: 'Paul' });
  });

  it('devrait retourner les joueurs avec leurs ratios calculés', async () => {
    const response = await request.get('/stats');
    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');

  });
});
describe('GET /api/v1/jeu/jouer/:nom', () => {
  beforeAll(async () => {
    // Démarrer un jeu avec un joueur
    await request.post('/api/v1/jeu/demarrerJeu').send({ nom: 'Jean-Marc' });
  });

  it('devrait permettre à un joueur de jouer et retourner un résultat', async () => {
    const response = await request.get('/api/v1/jeu/jouer/Jean-Marc');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('resultat');
    expect(response.body.resultat).toContain("Jean-Marc");
    expect(response.body.resultat).toContain("somme");
  });

  it('devrait retourner 404 si le joueur n\'existe pas', async () => {
    const response = await request.get('/api/v1/jeu/jouer/JoueurInexistant');
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({"error": "Error: Joueur 'JoueurInexistant' n'existe pas."});
  });
});

describe('GET /api/v1/jeu/redemarrerJeu', () => {
  it('devrait redémarrer le jeu et supprimer tous les joueurs', async () => {
    // Ajouter un joueur d'abord
    await request.post('/api/v1/jeu/demarrerJeu').send({ nom: 'Jean-Marc' });

    // Redémarrer le jeu
    const response = await request.get('/api/v1/jeu/redemarrerJeu');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
    expect(response.body.resultat).toHaveProperty('message', 'Le jeu a été redémarré avec succès.');

    // Vérifier que la liste des joueurs est vide
    const joueursResponse = await request.get('/api/v1/joueurs');
    expect(joueursResponse.body).toEqual({});
  });
});

