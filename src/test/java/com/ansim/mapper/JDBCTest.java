package com.ansim.mapper;

import lombok.extern.log4j.Log4j2;
import org.junit.Test;

import java.sql.Connection;
import java.sql.DriverManager;

import static org.junit.Assert.fail;

@Log4j2
public class JDBCTest {
    static {
        try {
            Class.forName("org.mariadb.jdbc.Driver");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testConnection() {
        try(Connection con =
                    DriverManager.getConnection(
                            "jdbc:mariadb://localhost:3306/srv?useUnicode=ture&characterEncoding=utf8&allowMultiQueries=true",
                            "root",
                            "1234"
                    )) {
            log.info("connection = " + con);
        }
        catch (Exception e) {
            fail(e.getMessage());
        }
    }
}
