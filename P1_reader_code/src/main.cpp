#include <iostream>

// C library headers
#include <stdio.h>
#include <string.h>

// Linux headers
#include <fcntl.h>   // Contains file controls like O_RDWR
#include <errno.h>   // Error integer and strerror() function
#include <termios.h> // Contains POSIX terminal control definitions
#include <unistd.h>  // write(), read(), close()

#include <string>
#include <fstream>
#include <iostream>

int main()
{
    std::cout << "Hello, World!" << std::endl;
    std::cin.get();

    std::string str;
    std::fstream f;
    f.open("/dev/ttyUSB0");
    while (f >> str)
    {
        std::cout << str;
    }
}