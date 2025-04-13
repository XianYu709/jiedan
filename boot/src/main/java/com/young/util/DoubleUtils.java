package com.young.util;


import java.math.BigDecimal;


public class DoubleUtils {


    public static Double add(Double v1, Double v2, Integer scale) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return round(b1.add(b2).doubleValue(), scale);
    }

    public static Double add(Double v1, Double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.add(b2).doubleValue();
    }

    public static BigDecimal add(BigDecimal v1, BigDecimal v2, Integer scale) {
        return round(v1.add(v2), scale);
    }


    public static Double sub(Double v1, Double v2, Integer scale) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return round(b1.subtract(b2).doubleValue(), scale);
    }

    public static Double sub(Double v1, Double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.subtract(b2).doubleValue();
    }

    public static BigDecimal sub(BigDecimal v1, BigDecimal v2, Integer scale) {
        return round(v1.subtract(v2), scale);
    }


    public static Double mul(Double v1, Double v2, Integer scale) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return round(b1.multiply(b2).doubleValue(), scale);
    }

    public static BigDecimal mul(BigDecimal v1, BigDecimal v2, Integer scale) {
        return round(v1.multiply(v2), scale);
    }

    public static Double mul(Double v1, Double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.multiply(b2).doubleValue();
    }


    public static Double div(Double v1, Double v2, Integer scale) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b2.doubleValue() == 0 ? 0.00 : b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    public static BigDecimal div(BigDecimal v1, BigDecimal v2, Integer scale) {
        return v2.doubleValue() == 0 ? v2 : v1.divide(v2, scale, BigDecimal.ROUND_HALF_UP);
    }

    public static Double div(Double v1, Double v2) {

        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));

        return b2.doubleValue() == 0 ? 0.00 : b1.divide(b2, 6, BigDecimal.ROUND_HALF_UP).doubleValue();

    }


    public static Double round(Double v, Integer scale) {
        if (!AirUtils.hv(v)) {
            return 0.0;
        }
        BigDecimal rs = new BigDecimal(Double.toString(v));
        return rs.setScale(scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    public static BigDecimal round(BigDecimal v, Integer scale) {
        return v.setScale(scale, BigDecimal.ROUND_HALF_UP);
    }


    public static Boolean ApproximatelyEqualTo(Double v1, Double v2, Double v3) {
        v1 = Math.abs(v1);
        v2 = Math.abs(v2);
        if (sub(Math.abs(sub(v1, v2)), v3) <= 0) {
            return true;
        } else {
            return false;
        }
    }


    public static Boolean ApproximatelyEqualTo(Double v1, Double v2) {
        v1 = Math.abs(v1);
        v2 = Math.abs(v2);
        if (sub(Math.abs(sub(v1, v2)), 10.0) <= 0) {
            return true;
        } else {
            return false;
        }
    }


}
