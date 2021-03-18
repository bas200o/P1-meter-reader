#include <string>
#include <fstream>
#include <iostream>

#include <mosquitto.h>

using namespace std;

int main()
{
	int rc;
	struct mosquitto * mosq;

	mosquitto_lib_init();

	mosq = mosquitto_new("meterm6", true, NULL);

	mosquitto_username_pw_set(mosq, "meter", "hamenkaastostie");

	rc = mosquitto_connect(mosq, "192.168.178.12", 1883, 60);
	if(rc != 0){
		printf("Client could not connect to broker! Error Code: %d\n", rc);
		mosquitto_destroy(mosq);
		return -1;
	}
	printf("We are now connected to the broker!\n");

	mosquitto_publish(mosq, NULL, "test/t1", 5, "Hello", 0, false);

	mosquitto_disconnect(mosq);
	mosquitto_destroy(mosq);

	mosquitto_lib_cleanup();
	return 0;
}