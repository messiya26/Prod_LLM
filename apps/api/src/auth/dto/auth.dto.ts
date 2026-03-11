import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches, IsNotEmpty } from "class-validator";

export class RegisterDto {
  @IsNotEmpty({ message: "Le prenom est requis" })
  @IsString({ message: "Le prenom doit etre du texte" })
  @MinLength(2, { message: "Le prenom doit contenir au moins 2 caracteres" })
  @MaxLength(50, { message: "Le prenom ne doit pas depasser 50 caracteres" })
  @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: "Le prenom contient des caracteres non autorises" })
  firstName!: string;

  @IsNotEmpty({ message: "Le nom est requis" })
  @IsString({ message: "Le nom doit etre du texte" })
  @MinLength(2, { message: "Le nom doit contenir au moins 2 caracteres" })
  @MaxLength(50, { message: "Le nom ne doit pas depasser 50 caracteres" })
  @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: "Le nom contient des caracteres non autorises" })
  lastName!: string;

  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail({}, { message: "L'adresse email n'est pas valide" })
  email!: string;

  @IsNotEmpty({ message: "Le mot de passe est requis" })
  @MinLength(8, { message: "Le mot de passe doit contenir au moins 8 caracteres" })
  @MaxLength(128, { message: "Le mot de passe ne doit pas depasser 128 caracteres" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre" })
  password!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+]?[\d\s()-]{6,20}$/, { message: "Le numero de telephone n'est pas valide" })
  phone?: string;
}

export class LoginDto {
  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail({}, { message: "L'adresse email n'est pas valide" })
  email!: string;

  @IsNotEmpty({ message: "Le mot de passe est requis" })
  @IsString()
  password!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}
