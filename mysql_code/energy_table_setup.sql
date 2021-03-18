USE meterbase;

CREATE table IF NOT EXISTS energy (
	CurrentTime datetime,
    TotalReceivedT1 double(32,3),
	TotalReceivedT2 double(32,3),
    TotalDeliverdT1 double(32,3),
    TotalDeliverdT2 double(32,3),
    CurrentUsage double(32,3),
    Currentdelivery double(32,3),
    CurrentVoltage1 int(16)
);