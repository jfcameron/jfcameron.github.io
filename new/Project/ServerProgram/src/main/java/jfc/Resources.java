package jfc;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 */
public class Resources
{
    private Resources()
    {
    }

    public static class Remote
    {
        private Remote()
        {
        }

        /**
         * @desc bad name
         * @param urlToRead
         * @return
         * @throws Exception 
         */
        public static String synchronousFetchText(String urlToRead) throws Exception
        {
            StringBuilder result = new StringBuilder();
            URL url = new URL(urlToRead);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String line;

            while ((line = rd.readLine()) != null)
                result.append(line);

            rd.close();

            return result.toString();
        }
    }

    ////// CLEAN BELOW /////
    /**
     * @desc RAII wrapper for FileSystem
     * @Warning this is bad. I like RAII. I like dtors. finalizer is not dtor.
     * who knows if close will ever get called replace with a util:
     * openFile(){fs.open(), file.open();} closeFile(){fs.close(),file.close();}
     */
    private static class FileSystemWrapper
    {
        private FileSystem m_FileSystem;

        public FileSystem getFileSystem()
        {
            return m_FileSystem;
        }

        public FileSystemWrapper(URI uri) throws IOException
        {
            try
            {
                m_FileSystem = FileSystems.newFileSystem(uri, Collections.emptyMap());
            }
            catch (IllegalArgumentException e)
            {
                m_FileSystem = FileSystems.getDefault();
            }
        }

        @Override
        @SuppressWarnings("FinalizeDeclaration")
        protected void finalize() throws Throwable
        {
            try
            {
                try
                {
                    // close is required by certain filesystems e.g jar
                    // but unrequired by others e.g UnixFileSystem
                    m_FileSystem.close();
                }
                catch (java.lang.UnsupportedOperationException ex)
                {
                }
            }
            catch (IOException t)
            {
                throw t;
            }
            finally
            {
                super.finalize();
            }
        }
    }

    /**
     * load a text file from disk, jar or zip file
     *
     * @param aFileName path to a text file
     * @return contents of the file
     */
    public static final String loadTextFile(final String aFileName)
    {
        String data = null;

        try
        {
            FileSystemWrapper fs = new FileSystemWrapper(ClassLoader.getSystemClassLoader().getResource(aFileName).toURI());

            data = new String(Files.readAllBytes(Paths.get(ClassLoader.getSystemClassLoader().getResource(aFileName).toURI())));
        }
        catch (IOException | URISyntaxException ex)
        {
            Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
        }

        return data;
    }
}
