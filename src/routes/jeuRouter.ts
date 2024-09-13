import { Router, Request, Response, NextFunction } from 'express';
import { JeuDeDes } from '../core/jeuDeDes';
import { InvalidParameterError } from '../core/errors/invalidParameterError';

export class JeuRouter {
  private _router: Router;
  private _controleurJeu: JeuDeDes;  // contrôleur GRASP

  get controleurJeu() {
    return this._controleurJeu;
  }

  get router() {
    return this._router;
  }

  /**
   * Initialiser le router
   */
  constructor() {
    this._controleurJeu = new JeuDeDes();  // un routeur pointe vers au moins un contrôleur GRASP
    this._router = Router();
    this.init();
  }

  /**
   * démarrer le jeu
   */
  public demarrerJeu(req: Request, res: Response, next: NextFunction) {
    const nom = req.body.nom;

    try {
      if (!nom) {
        throw new InvalidParameterError('Le paramètre nom est absent');
      }

      const joueur = this._controleurJeu.demarrerJeu(nom);
      const joueurObj = JSON.parse(joueur);
      req.flash('info', `Nouveau jeu pour ${nom}`);
      res.status(201)
        .send({
          message: 'Success',
          status: res.status,
          joueur: joueurObj
        });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  /**
   * jouer une fois aux dés
   */
  public jouer(req: Request, res: Response, next: NextFunction) {
    const nom = req.params.nom;
    try {
      const resultat = this._controleurJeu.jouer(nom);
      const resultatObj = JSON.parse(resultat);
      const key = resultatObj.somme == 7 ? 'win' : 'info';
      req.flash(key,
        `Résultat pour ${nom}: ${resultatObj.v1} + ${resultatObj.v2} = ${resultatObj.somme}`);
      res.status(200)
        .send({
          message: 'Success',
          status: res.status,
          resultat
        });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  /**
   * terminer
   */
  public terminerJeu(req: Request, res: Response, next: NextFunction) {
    const nom = req.params.nom;

    try {
      const resultat = this._controleurJeu.terminerJeu(nom);
      req.flash('info', `Jeu terminé pour ${nom}`);
      res.status(200)
        .send({
          message: 'Success',
          status: res.status,
          resultat
        });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  /**
   * redemarrerJeu - Nouvelle opération
   */
  public redemarrerJeu(req: Request, res: Response, next: NextFunction) {
    try {
      // Appel de l'opération système dans le contrôleur GRASP
      const resultat = this._controleurJeu.redemarrerJeu();

      // Flash pour informer l'utilisateur que l'application redémarre
      req.flash('info', 'Le jeu redémarre');

      // Envoyer une réponse 200 avec succès
      res.status(200).send({
        message: 'Success',
        status: res.status,
        resultat: JSON.parse(resultat)
      });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  /**
   * Fonction pour renvoyer une erreur 500
   */
  private _errorCode500(error: any, req: Request, res: Response<any, Record<string, any>>) {
    req.flash('error', error.message);
    res.status(error.code || 500).json({ error: error.toString() });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this._router.post('/demarrerJeu', this.demarrerJeu.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
    this._router.get('/jouer/:nom', this.jouer.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
    this._router.get('/terminerJeu/:nom', this.terminerJeu.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
    this._router.get('/redemarrerJeu', this.redemarrerJeu.bind(this)); // Lier l'URI à la méthode redemarrerJeu
  }
}

// exporter its configured Express.Router
export const jeuRoutes = new JeuRouter();
jeuRoutes.init();
