enum MyMotor {
    //% block="kiri"
    Left,
    //% block="kanan"
    Right
}
enum MyDirection {
    //% block="maju"
    Forward,
    //% block="mundur"
    Backward
}
enum RgbColor {
    //% block="merah"
    Red,
    //% block="hijau"
    Green,
    //% block="biru"
    Blue,
    //% block="kuning"
    Yellow,
    //% block="ungu"
    Purple,
    //% block="putih"
    White,
    //% block="mati"
    Off
}
namespace myRobotPlus {

    // ---------- NILAI DEFAULT (bisa diubah lewat block "atur pin...") ----------
    let pinMotorKiri = AnalogPin.P0
    let pinMotorKanan = AnalogPin.P1
    let pinArahKiri = DigitalPin.P8
    let pinArahKanan = DigitalPin.P12
    let pinTrig = DigitalPin.P13
    let pinEcho = DigitalPin.P14
    let pinLineKiri = DigitalPin.P15
    let pinLineKanan = DigitalPin.P16
    let pinBuzzer = AnalogPin.P2
    let pinLedR = AnalogPin.P3
    let pinLedG = AnalogPin.P4
    let pinLedB = AnalogPin.P10

    // ================= PENGATURAN PIN =================
    /**
     * Atur pin buat motor kiri (pin kecepatan & pin arah)
     */
    //% block="atur pin motor kiri: kecepatan %speedPin arah %dirPin"
    //% group="Pengaturan Pin"
    //% weight=100
    export function aturPinMotorKiri(speedPin: AnalogPin, dirPin: DigitalPin): void {
        pinMotorKiri = speedPin
        pinArahKiri = dirPin
    }

    /**
     * Atur pin buat motor kanan (pin kecepatan & pin arah)
     */
    //% block="atur pin motor kanan: kecepatan %speedPin arah %dirPin"
    //% group="Pengaturan Pin"
    //% weight=99
    export function aturPinMotorKanan(speedPin: AnalogPin, dirPin: DigitalPin): void {
        pinMotorKanan = speedPin
        pinArahKanan = dirPin
    }

    /**
     * Atur pin buat sensor ultrasonic (trig & echo)
     */
    //% block="atur pin ultrasonic: trig %trig echo %echo"
    //% group="Pengaturan Pin"
    //% weight=98
    export function aturPinUltrasonic(trig: DigitalPin, echo: DigitalPin): void {
        pinTrig = trig
        pinEcho = echo
    }

    /**
     * Atur pin buat sensor line-tracking kiri & kanan
     */
    //% block="atur pin sensor garis: kiri %kiri kanan %kanan"
    //% group="Pengaturan Pin"
    //% weight=97
    export function aturPinLineTracking(kiri: DigitalPin, kanan: DigitalPin): void {
        pinLineKiri = kiri
        pinLineKanan = kanan
    }

    /**
     * Atur pin buzzer
     */
    //% block="atur pin buzzer %pin"
    //% group="Pengaturan Pin"
    //% weight=96
    export function aturPinBuzzer(pin: AnalogPin): void {
        pinBuzzer = pin
    }

    /**
     * Atur pin LED RGB (3 kaki terpisah: merah, hijau, biru)
     */
    //% block="atur pin LED RGB: merah %r hijau %g biru %b"
    //% group="Pengaturan Pin"
    //% weight=95
    export function aturPinLED(r: AnalogPin, g: AnalogPin, b: AnalogPin): void {
        pinLedR = r
        pinLedG = g
        pinLedB = b
    }

    // ================= MOTOR =================
    /**
     * Menggerakkan motor tertentu dengan arah dan kecepatan
     */
    //% block="gerakkan motor %motor arah %direction kecepatan %speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    //% weight=100
    export function gerakMotor(motor: MyMotor, direction: MyDirection, speed: number): void {
        let pwm = Math.map(speed, 0, 100, 0, 1023)
        let arahPin = motor == MyMotor.Left ? pinArahKiri : pinArahKanan
        let speedPin = motor == MyMotor.Left ? pinMotorKiri : pinMotorKanan

        pins.digitalWritePin(arahPin, direction == MyDirection.Forward ? 1 : 0)
        pins.analogWritePin(speedPin, pwm)
    }

    /**
     * Menghentikan motor tertentu
     */
    //% block="hentikan motor %motor"
    //% group="Motor"
    //% weight=90
    export function stopMotor(motor: MyMotor): void {
        let speedPin2 = motor == MyMotor.Left ? pinMotorKiri : pinMotorKanan
        pins.analogWritePin(speedPin2, 0)
    }

    /**
     * Menghentikan semua motor sekaligus
     */
    //% block="hentikan semua motor"
    //% group="Motor"
    //% weight=80
    export function stopSemuaMotor(): void {
        pins.analogWritePin(pinMotorKiri, 0)
        pins.analogWritePin(pinMotorKanan, 0)
    }

    // ================= ULTRASONIC =================
    /**
     * Membaca jarak dari sensor ultrasonic (dalam cm)
     */
    //% block="baca jarak (cm)"
    //% group="Ultrasonic"
    //% weight=100
    export function bacaJarak(): number {
        pins.digitalWritePin(pinTrig, 0)
        control.waitMicros(2)
        pins.digitalWritePin(pinTrig, 1)
        control.waitMicros(10)
        pins.digitalWritePin(pinTrig, 0)

        let durasi = pins.pulseIn(pinEcho, PulseValue.High, 25000)
        let jarak = durasi * 0.034 / 2
        return Math.round(jarak)
    }

    // ================= LINE TRACKING =================
    /**
     * Membaca status sensor line-tracking kiri (true = kena garis)
     */
    //% block="sensor garis kiri terdeteksi"
    //% group="Line Tracking"
    //% weight=100
    export function sensorGarisKiri(): boolean {
        return pins.digitalReadPin(pinLineKiri) == 1
    }

    /**
     * Membaca status sensor line-tracking kanan (true = kena garis)
     */
    //% block="sensor garis kanan terdeteksi"
    //% group="Line Tracking"
    //% weight=90
    export function sensorGarisKanan(): boolean {
        return pins.digitalReadPin(pinLineKanan) == 1
    }

    // ================= LED RGB =================
    /**
     * Menyalakan LED RGB dengan warna tertentu (LED RGB 3 kaki, dikontrol lewat PWM)
     */
    //% block="nyalakan LED warna %color"
    //% group="LED"
    //% weight=100
    export function nyalakanLED(color: RgbColor): void {
        let r = 0, g = 0, b = 0
        switch (color) {
            case RgbColor.Red: r = 1023; g = 0; b = 0; break
            case RgbColor.Green: r = 0; g = 1023; b = 0; break
            case RgbColor.Blue: r = 0; g = 0; b = 1023; break
            case RgbColor.Yellow: r = 1023; g = 1023; b = 0; break
            case RgbColor.Purple: r = 1023; g = 0; b = 1023; break
            case RgbColor.White: r = 1023; g = 1023; b = 1023; break
            case RgbColor.Off: r = 0; g = 0; b = 0; break
        }
        pins.analogWritePin(pinLedR, r)
        pins.analogWritePin(pinLedG, g)
        pins.analogWritePin(pinLedB, b)
        basic.showNumber(r)
    }

    // ================= BUZZER =================
    /**
     * Membunyikan buzzer dengan frekuensi tertentu selama X ms
     */
    //% block="bunyikan buzzer frekuensi %freq selama %durasi ms"
    //% freq.min=100 freq.max=5000 durasi.min=100 durasi.max=5000
    //% group="Buzzer"
    //% weight=100
    export function bunyikanBuzzer(freq: number, durasi: number): void {
        pins.analogSetPitchPin(pinBuzzer)
        music.playTone(freq, durasi)
    }
}
myRobotPlus.aturPinLineTracking(DigitalPin.P7, DigitalPin.P6)
basic.pause(5000)
basic.forever(function () {
    myRobotPlus.nyalakanLED(RgbColor.Red)
})