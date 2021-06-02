/*******************************************
 * 
 *      P1 Reader
 *      This program will read telegram messages from the 
 *      Dutch P1 smart meter and put them on a MQTT broker.
 * 
 *      Author: Bas Winkelhof
 * 
 * ********************************************/

#include <string>
#include <fstream>
#include <iostream>
#include <mosquitto.h>
#include "json_structs/include/json_struct.h"

#define MQTT_USERNAME "meter"
#define MQTT_PASSWORD "hamenkaastostie"
#define MQTT_IP "plex.shitposts.nl"
#define MQTT_PORT 1883
#define MQTT_TOPIC "meter/energy"

#define SERIAL_PORT "/dev/ttyUSB0"

// Code snipit from https://github.com/domoticz/domoticz/blob/development/hardware/P1MeterBase.cpp
// changed some of the names and split the tarrif values.

// #define P1SMID		"/"				// Smart Meter ID. Used to detect start of telegram.
// #define P1VER		"1-3:0.2.8"		// P1 version
// #define P1VERBE		"0-0:96.1.4"	// P1 version + e-MUCS version (Belgium)
#define TIMESTAMP "0-0:1.0.0" // Timestamp

#define PWR_USE_TOT_T1 "1-0:1.8.1" // total power usage (including tariff indicator)
#define PWR_USE_TOT_T2 "1-0:1.8.2" // total power usage (including tariff indicator)
#define PWR_DEL_TOT_T1 "1-0:2.8.1" // total delivered power (including tariff indicator)
#define PWR_DEL_TOT_T2 "1-0:2.8.2" // total delivered power (including tariff indicator)

// #define P1TIP		"0-0:96.14.0"	// tariff indicator power

#define PWR_USE "1-0:1.7.0"   // current power usage
#define PWR_DEL "1-0:2.7.0"   // current power delivery
#define P1VOLTL1 "1-0:32.7.0" // voltage L1 (DSMRv5)

// #define P1VOLTL2	    "1-0:52.7.0"	// voltage L2 (DSMRv5)
// #define P1VOLTL3	    "1-0:72.7.0"	// voltage L3 (DSMRv5)
// #define P1AMPEREL1	"1-0:31.7.0"	// amperage L1 (DSMRv5)
// #define P1AMPEREL2	"1-0:51.7.0"	// amperage L2 (DSMRv5)
// #define P1AMPEREL3	"1-0:71.7.0"	// amperage L3 (DSMRv5)
// #define P1POWUSL1	"1-0:21.7.0"    // Power used L1 (DSMRv5)
// #define P1POWUSL2	"1-0:41.7.0"    // Power used L2 (DSMRv5)
// #define P1POWUSL3	"1-0:61.7.0"    // Power used L3 (DSMRv5)
// #define P1POWDLL1	"1-0:22.7.0"    // Power delivered L1 (DSMRv5)
// #define P1POWDLL2	"1-0:42.7.0"    // Power delivered L2 (DSMRv5)
// #define P1POWDLL3	"1-0:62.7.0"    // Power delivered L3 (DSMRv5)
// #define P1GTS		"0-n:24.3.0"	// DSMR2 timestamp gas usage sample
// #define P1GUDSMR2	"("				// DSMR2 gas usage sample
// #define P1GUDSMR4	"0-n:24.2."		// DSMR4 gas usage sample (excluding 'tariff' indicator)
// #define P1MBTYPE	    "0-n:24.1.0"	// M-Bus device type
#define P1EOT "!" // End of telegram.

using namespace std;

struct datagram
{
    string timestamp;
    string pwr_consuming;
    string pwr_delivering;
    string voltage;
    string pwr_consuming_total1;
    string pwr_consuming_total2;
    string pwr_delivering_total1;
    string pwr_delivering_total2;

    JS_OBJECT(JS_MEMBER(timestamp),
    JS_MEMBER(pwr_consuming),
    JS_MEMBER(pwr_delivering),
    JS_MEMBER(voltage),
    JS_MEMBER(pwr_consuming_total1),
    JS_MEMBER(pwr_consuming_total2),
    JS_MEMBER(pwr_delivering_total1),
    JS_MEMBER(pwr_delivering_total2));
};

/***
 * 
 * 
 *  
 *  @param f uninitialized filestream object
 *  @return Return if it goes well RC = 0
 */
int _INIT_STATE(fstream &f, struct mosquitto *mosq)
{
    // INIT MQTT BROKER
    int rc;
    mosquitto_username_pw_set(mosq, MQTT_USERNAME, MQTT_PASSWORD);

    rc = mosquitto_connect(mosq, MQTT_IP, MQTT_PORT, 60);
    if (rc != 0)
    {
        cout << "Client could not connect to broker! Error Code:" << rc << endl;
        mosquitto_destroy(mosq);
    }
    else
    {
        cout << "We are now connected to the broker!" << endl;
    }

    // INIT serial port
    f.open(SERIAL_PORT);
    if (!f)
    {
        cout << "Could not open serial port" << endl;
        f.close();
        rc = -2;
    }
    else
    {
        cout << "sucess opening serial port on: " << SERIAL_PORT << endl;
    }

    return rc;
}

/***
 * 
 * @param str A string from the COM port.
 * @return Returns 1 for end of datagram. Returns 0 for normal operation.
 */
int _READ_STATE(datagram &reading, string str)
{
    if (str.rfind(TIMESTAMP, 0) == 0)
    {
        std::string v = str.substr(10, 12);
        reading.timestamp = v;
    }
    if (str.rfind(PWR_USE_TOT_T1, 0) == 0)
    {
        std::string v = str.substr(10, 10);
        reading.pwr_consuming_total1 = v;
    }
    if (str.rfind(PWR_USE_TOT_T2, 0) == 0)
    {
        std::string v = str.substr(10, 10);
        reading.pwr_consuming_total2 = v;
    }
    if (str.rfind(PWR_DEL_TOT_T1, 0) == 0)
    {
        std::string v = str.substr(10, 10);
        reading.pwr_delivering_total1 = v;
    }
    if (str.rfind(PWR_DEL_TOT_T2, 0) == 0)
    {
        std::string v = str.substr(10, 10);
        reading.pwr_delivering_total2 = v;
    }
    if (str.rfind(PWR_USE, 0) == 0)
    {
        std::string v = str.substr(10, 6);
        reading.pwr_consuming = v;
    }
    if (str.rfind(PWR_DEL, 0) == 0)
    {
        std::string v = str.substr(10, 6);
        reading.pwr_delivering = v;
    }
    if (str.rfind(P1VOLTL1, 0) == 0)
    {
        std::string v = str.substr(11, 3);
        reading.voltage = v;
    }
    if (str.rfind(P1EOT, 0) == 0)
    {
        return 1;
    }
    return 0;
}

void _SEND_STATE(mosquitto *mosq, datagram &reading)
{
    string json_string = JS::serializeStruct(reading);
    cout << json_string << endl;

    mosquitto_publish(mosq, NULL, MQTT_TOPIC, json_string.length(), json_string.c_str(), 0, false);

    reading = {};
}

int main()
{
    std::string str;
    std::fstream f;
    mosquitto *mosq;

    mosquitto_lib_init();
    mosq = mosquitto_new("meterm6", true, NULL);

    int rc;
    rc = _INIT_STATE(f, mosq);

    if (rc != 0)
    {
        cout << "program exited with return code: " << rc;
        return rc;
    }

    datagram reading;
    while (f >> str)
    {
        int eof = _READ_STATE(reading, str);
        if (eof == 1)
        {
            _SEND_STATE(mosq, reading);
        }
    }
}