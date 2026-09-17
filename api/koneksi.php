<?php
$host     = "10.96.100.123"; 
$user     = "digita";      
$pass = "Niaga@123"; 

$db_main = "db_digita";  
$koneksi = mysqli_connect($host, $user, $pass, $db_main);
// Cek koneksi
if (!$koneksi) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

$db_sms = "smsd";
$koneksi_sms = mysqli_connect($host, $user, $pass, $db_sms);
// Cek koneksi
if (!$koneksi_sms) {
    die("Connection to SMS DB failed: " . mysqli_connect_error());
}
?>
