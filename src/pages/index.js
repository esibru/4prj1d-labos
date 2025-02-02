import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        {/* <p className="hero__subtitle">{siteConfig.tagline}</p> */}
        <div>
          <a
            className="button button--secondary button--lg"
            href="docs/TD 01 - Proof of concept/ex00-introduction"
          >
            Commencer les travaux dirigés
          </a>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Introduction`}
      description="Laboratoires 4PRJ1D">
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}

        <div className="text--left padding-horiz--md">
          <section>
            <p>
              Bienvenue dans cette série de travaux dirigés (TD) dédiée
              à l’apprentissage et à la mise en pratique de concepts
              de développement logiciel en Java.
            </p>
          </section>
          <section>
            <h3>Plan des Travaux Dirigés</h3>
            <ol>
              <li>
                <strong>Proof of Concept du projet</strong><br />
                Première étape du projet : exploration d’une librairie à travers la réalisation
                d’un Proof of Concept.
              </li>
              <li>
                <strong>Interface utilisateur avec Scene Builder</strong><br />
                Conception d’une interface utilisateur en utilisant JavaFX et Scene Builder.
              </li>
              <li>
                <strong>Programmation concurrente</strong><br />
                Introduction aux concepts de threads et découverte des techniques
                pour gérer les processus concurrents dans un projet Java.
              </li>
              <li>
                <strong>Java Database Connectivity</strong><br />
                Connexion d’une base de données à une application Java grâce à l’API JDBC.
                Manipulation des données à travers des requêtes SQL.
              </li>
              <li>
                <strong>Organiser le travail : modules Java et workflow Git</strong><br />
                Structuration d’un projet avec le système de modules Java et
                mise en pratique des workflows Git pour une collaboration efficace.
              </li>
              <li>
                <strong>Projet - Analyse</strong><br />
                Conception/Modélisation et planification du projet.
                Description des besoins utilisateurs, création des diagrammes UML (cas d'utilisation, classes, séquences)
                et élaboration du plan de tests.
                <li>
                  <strong>Projet - Implémentation</strong><br />
                  Développement et intégration des différentes fonctionnalités du projet
                  en s’appuyant sur l’analyse initiale et les sujets étudiés en TD.
                </li>
                <li>
                  <strong>Présentation du projet</strong><br />
                  Présentation de votre projet et critique des choix effectués
                  tant dans la conception que dans le développement.</li>
              </li>
            </ol>
          </section>

        </div>
      </main>
    </Layout>
  );
}
