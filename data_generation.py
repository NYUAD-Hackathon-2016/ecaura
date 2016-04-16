import numpy as np 

np.set_printoptions(linewidth=150)

yearly_multiplier = np.random.normal(1, .1)
months = 12

electricity_average = 4119916.
oil_average = 22800.
waste_average = 2929171.
water_average = 8177.

averages = np.array([electricity_average, oil_average, waste_average, water_average])

data = np.zeros((len(averages), months))


for i in range(months):
	this_month_averages = averages
	if i > 5 and i < 9:
		this_month_averages = this_month_averages*1.25
	samples = np.random.normal(this_month_averages, .1*this_month_averages)
	data[:, i] = samples
	averages *= yearly_multiplier
data = data.T
print data.astype(int)
np.savetxt("data.csv", data.astype(int), delimiter=',' ,fmt="%d")
