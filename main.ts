namespace SHT31 {
    let sht31Address = 0x44

    //% blockId=sht31_set_addr 
    //% block="set SHT31 I2C address %addr"
    //% weight=70
    //% group="Setup"
    export function setAddress(addr: SHT31_ADDR): void {
        sht31Address = addr
    }

    /**
     * Read ambient temperature from SHT31 sensor in degrees Celsius (°C)
     */
    //% blockId=sht31_get_temperature 
    //% block="SHT31 temperature (°C)"
    //% weight=100
    //% group="Readings"
    export function readTemperature(): number {
        let cmd = pins.createBuffer(2)
        cmd[0] = 0x2C
        cmd[1] = 0x06
        pins.i2cWriteBuffer(sht31Address, cmd)

        basic.pause(20)

        let data = pins.i2cReadBuffer(sht31Address, 6)
        if (data.length < 6) return 0

        let rawTemp = (data[0] << 8) | data[1]
        let temp = -45 + (175 * rawTemp / 65535.0)

        return Math.round(temp * 10) / 10
    }

    /**
     * Read relative humidity from SHT31 sensor (%RH)
     */
    //% blockId=sht31_get_humidity 
    //% block="SHT31 humidity (%%RH)"
    //% weight=90
    //% group="Readings"
    export function readHumidity(): number {
        let cmd2 = pins.createBuffer(2)
        cmd2[0] = 0x2C
        cmd2[1] = 0x06
        pins.i2cWriteBuffer(sht31Address, cmd2)

        basic.pause(20)

        let data2 = pins.i2cReadBuffer(sht31Address, 6)
        if (data2.length < 6) return 0

        let rawHum = (data2[3] << 8) | data2[4]
        let hum = 100 * (rawHum / 65535.0)

        return Math.round(hum * 10) / 10
    }
}
enum SHT31_ADDR {
    //% block="0x44 (default)"
    ADDR_0x44 = 0x44,
    //% block="0x45 (ADDR connected to VCC)"
    ADDR_0x45 = 0x45
}
