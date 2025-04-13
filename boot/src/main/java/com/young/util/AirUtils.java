package com.young.util;


import org.apache.commons.lang3.StringUtils;

import java.io.*;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public final class AirUtils {
    private AirUtils() {
        throw new AssertionError();
    }


    public static final int PRICE_SCALE = 2;


    public static final int QTY_AMOUNT_RATE_SCALE = 4;

    private static final Pattern PATTERN_NUMBER = Pattern.compile("\\d+$");

    private static final Pattern PATTERN_LETTER = Pattern.compile("[a-zA-Z]+$");

    private static final Pattern PATTERN_FLOAT = Pattern.compile("\\d+.\\d*$");

    private static final Pattern PATTERN_CHINESE = Pattern.compile("[\\u4e00-\\u9fa5]+");

    public static final String DATE_TIME = "yyyy-MM-dd HH:mm:ss";

    private static final String NULL_STR = "NULL";

    private static final String NULL_STR2 = "null";

    private static final String SPACE_STR = " ";


    public static boolean hv(String rs) {
        return rs != null && rs.length() > 0;
    }


    public static boolean hv(Integer rs) {
        return rs != null;
    }


    public static boolean hv(Double rs) {
        return rs != null && rs != 0d;
    }


    public static boolean hv(Date rs) {
        return rs != null;
    }


    public static boolean hv(Long rs) {
        return rs != null && rs != 0L;
    }


    public static boolean hv(String[] str) {
        return str != null && str.length > 0;
    }


    public static boolean hv(List<?> list) {
        if (list != null && list.size() > 0) {
            if (hv(list.get(0))) {
                return true;
            }
        }
        return false;
    }


    public static boolean hv(Object obj) {
        return obj != null;
    }


    public static boolean hv(Map obj) {
        if (obj != null && !obj.isEmpty()) {
            return true;
        }
        return false;
    }


    public static boolean hv(Collection coll) {
        return coll != null && !coll.isEmpty();
    }


    public static boolean hv(Object[] obj) {
        return obj != null && obj.length > 0;
    }


    public static boolean hv(Object obj, Object... args) {
        if (!hv(obj)) {
            return false;
        }
        for (Object arg : args) {
            if (!hv(arg)) {
                return false;
            }
        }
        return true;
    }


    public static boolean oneHv(Object... args) {
        for (Object arg : args) {
            if (arg instanceof String) {
                if (hv(AirUtils.ts(arg))) {
                    return true;
                }
            } else {
                if (hv(arg)) {
                    return true;
                }
            }
        }
        return false;
    }


    public static boolean eq(Object src, Object dest) {
        if (src == null && dest == null) {
            return true;
        }
        return hv(src) ? src.equals(dest) : dest.equals(src);
    }


    public static String ts(Object obj) {
        return hv(obj) ? String.valueOf(obj) : null;
    }


    public static String ts(String rs) {
        return rs == null ? "" : rs;
    }


    public static String sqm(String rs) {
        return replace(rs, "'", "''");
    }


    public static String replace(String rs, CharSequence target, CharSequence replacement) {
        return rs == null ? "" : rs.replace(target, replacement);
    }


    public static Integer ti(String rs) {
        return hv(rs) ? Integer.parseInt(rs) : null;
    }


    public static Integer ti(Integer rs) {
        return hv(rs) ? rs : 0;
    }


    public static Integer ti(Long rs) {
        return hv(rs) ? rs.intValue() : null;
    }


    public static Double td(String rs) {
        return hv(rs) ? Double.parseDouble(rs) : null;
    }


    public static Double ta(Double rs) {
        return hv(rs) ? rs : 0.00;
    }


    public static Double ta(Long rs) {
        return hv(rs) ? Double.parseDouble(AirUtils.ts(rs)) : 0.00;
    }


    public static Long tl(String str) {
        return hv(str) ? Long.parseLong(str) : null;
    }


    public static Long tl(Integer i, Long dec) {
        return hv(i) ? Long.valueOf(i) : dec;
    }


    public static Long tl(Integer i) {
        return hv(i) ? Long.valueOf(i) : null;
    }


    public static Long tl(Long rs) {
        return hv(rs) ? rs : 0;
    }


    public static void pe(Exception e) {
        e.printStackTrace();
    }


    public static String fd(Date date) {
        return fd(date, "yyyy-MM-dd");
    }


    public static Date addDate(Date date, int day) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, day);
        return calendar.getTime();
    }


    public static String fd(Date date, String args) {
        return hv(date) ? new SimpleDateFormat(args).format(date) : null;
    }


    public static String fdA(Date date, String args) {


        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.HOUR_OF_DAY, 23);
        c.set(Calendar.MINUTE, 59);
        c.set(Calendar.SECOND, 59);

        return hv(c.getTime()) ? new SimpleDateFormat(args).format(c.getTime()) : null;
    }


    public static Date fdA(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.HOUR_OF_DAY, 23);
        c.set(Calendar.MINUTE, 59);
        c.set(Calendar.SECOND, 59);

        return c.getTime();
    }


    public static Date maxDayTime(String dateString) {
        Calendar c = Calendar.getInstance();
        c.setTime(str2Date(dateString));
        c.set(Calendar.HOUR_OF_DAY, 23);
        c.set(Calendar.MINUTE, 59);
        c.set(Calendar.SECOND, 59);
        return c.getTime();
    }


    public static Date minDayTime(String dateString) {
        Calendar c = Calendar.getInstance();
        c.setTime(str2Date(dateString));
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        return c.getTime();
    }


    public static Integer ls(List<Object> list) {
        return hv(list) ? list.size() : 0;
    }


    public static Double padd(Double v1, Double v2) {
        return DoubleUtils.add(ta(v1), ta(v2), QTY_AMOUNT_RATE_SCALE);
    }


    public static Double psub(Double v1, Double v2) {
        return DoubleUtils.sub(ta(v1), ta(v2), QTY_AMOUNT_RATE_SCALE);
    }


    public static Double pmui(Double v1, Double v2) {
        return DoubleUtils.mul(ta(v1), ta(v2), QTY_AMOUNT_RATE_SCALE);
    }


    public static Double pmui2(Double v1, Double v2) {
        return DoubleUtils.mul(ta(v1), ta(v2), QTY_AMOUNT_RATE_SCALE);
    }


    public static Double pdiv(Double v1, Double v2) {
        return DoubleUtils.div(ta(v1), ta(v2), QTY_AMOUNT_RATE_SCALE);
    }


    public static Double pround(Double v1) {
        return DoubleUtils.round(ta(v1), QTY_AMOUNT_RATE_SCALE);
    }


    public static Double pround(Double v1, Integer scale) {
        return DoubleUtils.round(ta(v1), scale);
    }


    public static Double qadd(Double v1, Double v2) {
        return DoubleUtils.add(ta(v1), ta(v2), QTY_AMOUNT_RATE_SCALE);
    }


    public static Double qsub(Double v1, Double v2) {
        return DoubleUtils.sub(ta(v1), ta(v2), QTY_AMOUNT_RATE_SCALE);
    }


    public static Double qsub(Double v1, Double v2, Integer scale) {
        return DoubleUtils.sub(ta(v1), ta(v2), scale);
    }


    public static Double qmui(Double v1, Double v2) {
        return DoubleUtils.mul(ta(v1), ta(v2), QTY_AMOUNT_RATE_SCALE);
    }


    public static Double qdiv(Double v1, Double v2) {
        return DoubleUtils.div(ta(v1), ta(v2), QTY_AMOUNT_RATE_SCALE);
    }


    public static Double qround(Double v1) {
        return DoubleUtils.round(ta(v1), QTY_AMOUNT_RATE_SCALE);
    }


    public static Double abs(Double v1) {
        return new BigDecimal(v1).abs().doubleValue();
    }


    public static Double ceil(Double v1) {
        return Math.ceil(v1);
    }


    public static Integer getDayOfWeek(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.DAY_OF_WEEK);
    }


    public static boolean isChinese(String str) {
        return hv(str) && PATTERN_CHINESE.matcher(str).find();
    }


    public static boolean isNaN(String str) {
        return hv(str) && Character.isDigit(str.charAt(0));
    }


    public static boolean isLetter(String str) {
        return hv(str) && Character.isLetter(str.charAt(0));
    }


    public static Date str2Date(String str, String pattern) {
        if (!AirUtils.hv(str)) {
            return null;
        }

        SimpleDateFormat simpledateformat = new SimpleDateFormat(pattern);
        ParsePosition parseposition = new ParsePosition(0);
        Date date = simpledateformat.parse(str, parseposition);
        return date;
    }


    public static Date str2Date(String str) {
        return str2Date(str, "yyyy-MM-dd");
    }


    public static String tn(String str) {
        if (AirUtils.hv(str)) {
            if (str.contains("|")) {
                return str.split("\\|")[1];
            } else {
                return str;
            }
        }
        return str;
    }


    public static String nvl(boolean bool, String exp1, String exp2) {
        return bool ? exp1 : exp2;
    }


    public static Date ldom(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        return calendar.getTime();
    }


    public static Date fdom(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMinimum(Calendar.DAY_OF_MONTH));
        return calendar.getTime();
    }


    public static String getCurrentDate() {
        return AirUtils.fd(new Date());
    }


    public static int getDate(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.DATE);
    }


    public static boolean isDigital(String code) {
        Matcher dMatcher = PATTERN_NUMBER.matcher(code);
        return dMatcher.matches();
    }

    public static boolean isDigital2(String code) {
        Matcher dMatcher = PATTERN_FLOAT.matcher(code);
        Matcher dMatcher1 = PATTERN_NUMBER.matcher(code);
        return dMatcher.matches() || dMatcher1.matches();
    }


    public static boolean isCharacter(String code) {
        Matcher wMatcher = PATTERN_LETTER.matcher(code);
        return wMatcher.matches();
    }


    public static String formatMoney(Object val) {
        DecimalFormat dFormat = new DecimalFormat("#0.00");
        return dFormat.format(val);
    }


    public static String decodeURI(String code, String encoding) {
        try {
            return java.net.URLDecoder.decode(code, encoding);
        } catch (UnsupportedEncodingException e) {
            AirUtils.pe(e);
        }
        return "";
    }


    public static int daysBetween(Date start, Date end) {
        start = AirUtils.str2Date(AirUtils.fd(start));
        end = AirUtils.str2Date(AirUtils.fd(end));
        Calendar cal = Calendar.getInstance();
        cal.setTime(start);
        long time1 = cal.getTimeInMillis();
        cal.setTime(end);
        long time2 = cal.getTimeInMillis();
        long betweenDays = (time2 - time1) / (1000 * 3600 * 24);
        return Integer.parseInt(String.valueOf(betweenDays));
    }


    public static boolean eqListValue(List<? extends Object> obj1, List<? extends Object> obj2) {
        if (null == obj1 || null == obj2) {
            throw new RuntimeException("eqList 不能传入null 对象,请查看.");
        }
        return obj1.containsAll(obj2) && obj2.containsAll(obj1);
    }


    public static Boolean isDouble(String str, Integer scale) {
        try {

            Double.valueOf(str);

            String[] s = str.split("\\.");
            if (s.length > 1 && s[1].length() > scale) {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
        return true;
    }


    public static int checkIsInteger(BigDecimal bigDecimal) {


        BigDecimal floor = bigDecimal.setScale(0, BigDecimal.ROUND_DOWN);
        int compileResult = bigDecimal.compareTo(floor);
        if (compileResult == 0) {
            return 1;
        }
        return 0;
    }

    public static String[] list2StringArray(List<String> list) {
        if (null == list) {
            return null;
        }
        int size = list.size();
        if (0 == size) {
            return null;
        }

        String[] res = new String[size];
        res = list.toArray(res);
        return res;
    }


    public static Map<Integer, List<String>> groupDateRange(Date startDate, Date endDate) {
        if (startDate.after(endDate)) {
            return new HashMap<>();
        } else {
            Map<Integer, List<String>> weekHashMap = new HashMap<>();
            Calendar c = Calendar.getInstance();
            while (!startDate.after(endDate)) {
                c.setTime(startDate);
                if (weekHashMap.containsKey(c.get(Calendar.DAY_OF_WEEK))) {
                    weekHashMap.get(c.get(Calendar.DAY_OF_WEEK)).add(fd(startDate));
                } else {
                    List<String> dateList = new ArrayList<String>();
                    dateList.add(fd(startDate));
                    weekHashMap.put(c.get(Calendar.DAY_OF_WEEK), dateList);
                }
                startDate = addDate(startDate, 1);
            }
            return weekHashMap;
        }
    }


    public static boolean equalsIgnoreNull(String src, String dst) {
        if (StringUtils.isBlank(src)) {
            if (StringUtils.isBlank(dst)) {
                return true;
            } else {
                return false;
            }
        } else {
            if (StringUtils.isNotBlank(dst)) {
                return eq(src, dst);
            } else {
                return false;
            }
        }
    }


    public static <T> List<T> listDeepCopy(List<T> srcList) throws Exception {

        ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
        ObjectOutputStream out = new ObjectOutputStream(byteOut);
        out.writeObject(srcList);
        out.flush();
        byte[] objBytes = byteOut.toByteArray();
        out.close();

        ByteArrayInputStream byteIn = new ByteArrayInputStream(objBytes);
        ObjectInputStream inStream = new ObjectInputStream(byteIn);
        List<T> destList = (List<T>) inStream.readObject();
        inStream.close();
        return destList;

    }


    public static boolean isNull(String object) {
        if (StringUtils.isNotBlank(object)) {
            if (NULL_STR2.equals(object) || NULL_STR.equals(object)) {
                return true;
            }
            return false;
        }
        return true;
    }


    public static String saveInnerSpace(String str) {
        if (!AirUtils.hv(str)) {
            return str;
        }
        str = str.trim();
        while (str.startsWith(SPACE_STR)) {
            str = str.substring(1, str.length()).trim();
        }
        while (str.endsWith(SPACE_STR)) {
            str = str.substring(0, str.length() - 1).trim();
        }
        return str;
    }


    public static <T extends Comparable<T>> boolean compare(List<T> a, List<T> b) {
        if (a.size() != b.size())
            return false;
        Collections.sort(a);
        Collections.sort(b);
        for (int i = 0; i < a.size(); i++) {
            if (!a.get(i).equals(b.get(i)))
                return false;
        }
        return true;
    }

}
