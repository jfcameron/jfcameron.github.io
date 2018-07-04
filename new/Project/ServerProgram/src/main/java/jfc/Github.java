package jfc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 * @desc object that does gh stuff
 * @warn very much WIP
 */
public class Github
{
    final List<String> m_IgnoreList = Arrays.asList(
            ".emacs.d",
            "bash-settings"
    );

    final List<Repository> m_Repositories = new ArrayList<>();

    final String m_OAuthToken;

    int m_RequestCout = 0; /// gh limits request (5k/hr) so this is good to record
    
    /**
     * @desc Models a github repository
     */
    public class Repository
    {
        private final String m_Name;

        private final Map<String, Long> m_Languages;

        private Repository(JSONObject aRepositoryJSON) throws Exception
        {
            m_Name = aRepositoryJSON.get("name").toString();

            JSONParser parser = new JSONParser();

            m_Languages = new HashMap<>();

            JSONObject languages = (JSONObject) parser.parse(
                        Resources.Remote.synchronousFetchText(buildURL(
                                ((JSONObject) aRepositoryJSON).get("languages_url").toString())));

            System.out.println("Repository: " + m_Name);
            
            for(Iterator iterator = languages.keySet().iterator(); iterator.hasNext();) 
            {
                String key = (String)iterator.next();
                //System.out.println(languages.get(key));
                
                m_Languages.put(key, m_Languages.containsKey(key) ? 
                        (long)m_Languages.get(key) + (long)languages.get(key) :
                        (long)languages.get(key));
            }
            
            for (String key : m_Languages.keySet()) 
            {
                System.out.println(key + ": " + m_Languages.get(key));
            }
            
            System.out.println();
        }
    }

    private String buildURL(final String aURL)
    {
        m_RequestCout++;
        
        return m_OAuthToken != null
                ? aURL + "?access_token=" + m_OAuthToken
                : aURL;
    }

    /**
     * @desc generates data models for a github account
     * @param aGithubAccountName Name of the account to generate models for
     * @param aOAuthToken an oauth token to perform authenticated api calls with.
     *  This token does NOT have to be associated with aGithubAccountName (for public repos)
     *  and is entirely optional. It is only needed in case the user's external IP has exceeded the github api usage limit.
     *  (e.g. the user is in the office of a software development company)
     * @throws Exception 
     */
    public Github(final String aGithubAccountName, final String aOAuthToken) throws Exception
    {
        m_OAuthToken = aOAuthToken;
        
        JSONParser parser = new JSONParser();
        
        final JSONArray repos;

        repos = (JSONArray) parser.parse(Resources.Remote.synchronousFetchText(
                buildURL("https://api.github.com/users/" + aGithubAccountName + "/repos")));

        for (final Object repo : repos)
            m_Repositories.add(new Repository((JSONObject) repo));
        
        System.out.println("Request count: " + m_RequestCout);
    }
    public Github(final String aGithubAccountName) throws Exception
    {
        this(aGithubAccountName, null);
    }
}
