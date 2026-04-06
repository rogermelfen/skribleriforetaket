<?php
/**
 * send-skjema.php
 * Bruker PHPMailer med Hostinger SMTP for pålitelig e-postlevering.
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// ── Konfigurasjon ───────────────────────────────────────────
$smtp_host     = 'smtp.hostinger.com';
$smtp_port     = 587;
$smtp_bruker   = 'kontakt@skribleriforetaket.no';
$smtp_passord  = 'Knulleri1969!';
$mottaker      = 'kontakt@skribleriforetaket.no';
$emne          = 'Ny portrettintervju-innmelding';

$redirect_ok   = 'portrettintervju.html?sendt=ok';
$redirect_feil = 'portrettintervju.html?sendt=feil';
// ────────────────────────────────────────────────────────────

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: portrettintervju.html');
    exit;
}

function rens($v) {
    return htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES, 'UTF-8');
}

$navn        = rens($_POST['navn']       ?? '');
$alder       = rens($_POST['alder']      ?? '');
$bosted      = rens($_POST['bosted']     ?? '');
$yrke        = rens($_POST['yrke']       ?? '');
$epost       = filter_var(trim($_POST['epost'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefon     = rens($_POST['telefon']    ?? '');
$profil      = rens($_POST['profil']     ?? '');
$hvem        = rens($_POST['hvem']       ?? '');
$historie    = rens($_POST['historie']   ?? '');
$hvorfor     = rens($_POST['hvorfor']    ?? '');
$tidligere   = rens($_POST['tidligere']  ?? '');
$publisering = rens($_POST['publisering'] ?? '');

if (empty($navn) || empty($yrke) || empty($epost) || empty($hvem) || empty($historie) || empty($publisering)) {
    header('Location: ' . $redirect_feil);
    exit;
}

if (!filter_var($epost, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $redirect_feil);
    exit;
}

$melding  = "Ny innmelding til portrettintervju\n";
$melding .= str_repeat('=', 50) . "\n\n";
$melding .= "OM PERSONEN\n" . str_repeat('-', 30) . "\n";
$melding .= "Navn:       $navn\n";
$melding .= "Alder:      $alder\n";
$melding .= "Bosted:     $bosted\n";
$melding .= "Yrke/rolle: $yrke\n";
$melding .= "E-post:     $epost\n";
$melding .= "Telefon:    $telefon\n";
$melding .= "Profil:     $profil\n\n";
$melding .= "HISTORIEN\n" . str_repeat('-', 30) . "\n";
$melding .= "Hvem er du?\n$hvem\n\n";
$melding .= "Historien/erfaringen/prosjektet:\n$historie\n\n";
$melding .= "Hvorfor egner det seg som portrettintervju?\n$hvorfor\n\n";
$melding .= "Intervjuet om dette før: $tidligere\n\n";
$melding .= "PUBLISERING\n" . str_repeat('-', 30) . "\n";
$melding .= "Komfortabel med publisering: $publisering\n";

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $smtp_host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp_bruker;
    $mail->Password   = $smtp_passord;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $smtp_port;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($smtp_bruker, 'Skribleriforetaket Skjema');
    $mail->addAddress($mottaker);
    $mail->addReplyTo($epost, $navn);

    $mail->Subject = $emne;
    $mail->Body    = $melding;

    $mail->send();
    header('Location: ' . $redirect_ok);
} catch (Exception $e) {
    header('Location: ' . $redirect_feil);
}
exit;