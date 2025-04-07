import { Dialog } from "@/components";
import styles from "./../UserModal.module.scss";
import { Button, Field } from "@/ui";
import { FC, useEffect, useState } from "react";
import { UserModalI } from "../UserModal";
import { userAPI } from "@/api";
import { useSnackbar } from "notistack";

const ChangePassword: FC<UserModalI> = ({ onClose }) => {
  const [passwords, setPasswords] = useState({
    password: "",
    repeatPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // State for password strength criteria
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handleChange = (field: string, value: string) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "newPassword") {
      const newPassword = value;
      setPasswordCriteria({
        minLength: newPassword.length >= 8,
        hasUpperCase: /[A-Z]/.test(newPassword),
        hasLowerCase: /[a-z]/.test(newPassword),
        hasNumber: /\d/.test(newPassword),
        hasSpecialChar: /[ !\"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(newPassword),
      });
    }
  };

  useEffect(() => {
    if (passwords.password && passwords.repeatPassword) {
      if (passwords.password !== passwords.repeatPassword) {
        setError("Пароли не совпадают");
        setCanSubmit(false);
      } else {
        setError("");
        // Check if all password criteria are met
        const allCriteriaMet = Object.values(passwordCriteria).every(
          (criterion) => criterion
        );
        setCanSubmit(allCriteriaMet);
      }
    }
  }, [passwords.password, passwords.repeatPassword, passwordCriteria]);

  const updatePassword = () => {
    try {
      const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`);
      const userId = localStorage.getItem(`${process.env.API_URL}_id`);
      if (!accessToken) {
        setError("Токен доступа не найден");
        return;
      }

      const data = {
        oldPassword: passwords.password,
        repeatedPassword: passwords.repeatPassword,
        newPassword: passwords.newPassword,
      };
      if (userId) {
        userAPI.updateUserPassword(userId, data).then((res) => {
          enqueueSnackbar("Пароль обновлён", {
            variant: "success",
            autoHideDuration: 3000,
          });
          onClose();
        });
      }
    } catch (err) {
      console.error("Ошибка при смене пароля:", err);
      setError("Не удалось сменить пароль, попробуйте еще раз.");
    }
  };

  return (
    <Dialog title="Смена пароля" onClose={onClose} closeBtn className={styles.el}>
      <div className={styles.form}>
        <Field
          label="Текущий пароль"
          type="password"
          value={passwords.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />
        <Field
          label="Подтверждение пароля"
          type="password"
          value={passwords.repeatPassword}
          onChange={(e) => handleChange("repeatPassword", e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Field
          label="Новый пароль"
          type="password"
          value={passwords.newPassword}
          onChange={(e) => handleChange("newPassword", e.target.value)}
        />

        {/* Display password criteria */}
        <div className={styles.passwordCriteria}>
          <p className={passwordCriteria.minLength ? styles.valid : styles.invalid}>
            Минимум 8 символов
          </p>
          <p className={passwordCriteria.hasUpperCase ? styles.valid : styles.invalid}>
            Одна заглавная буква
          </p>
          <p className={passwordCriteria.hasLowerCase ? styles.valid : styles.invalid}>
            Одна строчная буква
          </p>
          <p className={passwordCriteria.hasNumber ? styles.valid : styles.invalid}>
            Одна цифра
          </p>
          <p className={passwordCriteria.hasSpecialChar ? styles.valid : styles.invalid}>
            Один специальный символ
          </p>
        </div>
      </div>
      <Button title="Сохранить" onClick={updatePassword} disabled={!canSubmit} />
    </Dialog>
  );
};

export default ChangePassword;