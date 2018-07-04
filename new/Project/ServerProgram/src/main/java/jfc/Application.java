package jfc;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @desc entry for this project
 */
public class Application
{
    public static void main(String[] args) throws Exception
    {
        printBuildData();

        String oauthtoken = null;

        if (args.length > 0)
            oauthtoken = args[0];

        Github m_GHPublicParser = new Github(
                "jfcameron", //Account name
                oauthtoken, //git oauth token
                true, //ignore forks
                Arrays.asList( //ignore repos by name
                        "bash-settings",
                        "TF2-Bindings"
                )
        );
    }

    private static void printBuildData()
    {
        for (final Field field : jfc.BuildInfo.class.getDeclaredFields())
            try
            {
                System.out.println(field.getName() + ": " + field.get(null));
            }
            catch (IllegalArgumentException | IllegalAccessException ex)
            {
                Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
            }
    }
}
