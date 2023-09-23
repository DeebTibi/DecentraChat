import styles from "./page.module.css";
import Button from "@/components/interactables/Button/Button.js";
export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero_container}>
        <div>
          <a className={styles.hero_text}>Hi, Welcome to </a>
          <a className={styles.decentra_chat}>DecentraChat</a>
        </div>
        <div style={{ width: "100ch" }}>
          <a className={styles.secondary_text}>
            A chat application where chats are controlled by everyone in a
            decentralized manner.
          </a>
        </div>
        <Button
          text={"Get Started"}
          isBtn={false}
          size={"btn_medium"}
          theme={"btn_main"}
          location="/signup"
        />
      </div>
    </main>
  );
}
