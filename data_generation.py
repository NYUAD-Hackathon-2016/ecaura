import numpy as np 


yearly_multiplier = .9
num_years = 10

electricity_average = 4119916.
oil_average = 22800.
waste_average = 2929171.
water_average = 8177.

averages = np.array([electricity_average, oil_average, waste_average, water_average])

data = np.zeros((len(averages), num_years))


for i in range(num_years):
	samples = np.random.normal(averages, .1*averages)
	data[:, i] = samples
	averages *= yearly_multiplier

print data.astype(int)
