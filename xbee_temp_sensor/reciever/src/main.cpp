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
#define MQTT_TOPIC "meter/temp"

#define SERIAL_PORT "/dev/ttyUSB0"

using namespace std;

/***
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

void _SEND_STATE(mosquitto *mosq, string json_string)
{
    cout << json_string << endl;

    mosquitto_publish(mosq, NULL, MQTT_TOPIC, json_string.length(), json_string.c_str(), 0, false);
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

    while (f >> str)
    {
        _SEND_STATE(mosq, str);
    }
}