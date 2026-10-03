import { Link } from 'react-router-dom'
import heroImage from '../../assets/hero.png'
import styles from './HomePage.module.css'

const benefits = [
  { value: '32,000 +', caption: 'Experienced tutors' },
  { value: '300,000 +', caption: '5-star tutor reviews' },
  { value: '120 +', caption: 'Subjects taught' },
  { value: '200 +', caption: 'Tutor nationalities' },
]

export function HomePage() {
  return (
    <main>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.intro}>
          <div>
            <h1 id="home-title" className={styles.title}>
              Unlock your potential with the best <span className={styles.accent}>language</span>{' '}
              tutors
            </h1>
            <p className={styles.text}>
              Embark on an Exciting Language Journey with Expert Language Tutors: Elevate your
              language proficiency to new heights by connecting with highly qualified and
              experienced tutors.
            </p>
          </div>
          <Link className={styles.cta} to="/teachers">
            Get started
          </Link>
        </div>
        <div className={styles.visual}>
          <img
            className={styles.visualImage}
            src={heroImage}
            alt="Student learning languages online with a laptop"
            width={568}
            height={530}
          />
        </div>
      </section>

      <ul className={styles.stats}>
        {benefits.map((item) => (
          <li key={item.caption}>
            <span className={styles.value}>{item.value}</span>
            <span className={styles.caption}>{item.caption}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
