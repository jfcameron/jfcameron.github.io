package jfc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 * @desc Models a github account
 * @warn does not (yet) support all account data
 * @warn some data is calculated not fetched
 * @warn very much WIP
 */
public class Github
{
    final List<String> m_RepoIgnoreList;

    final List<Repository> m_Repositories = new ArrayList<>();

    final String m_OAuthToken;

    int m_RequestCout = 0; /// gh limits request (5k/hr) so this is good to record

    private final Map<String, Long> m_TotalLanguageScores = new HashMap<>();

    /**
     * @desc Models a github repository
     */
    public class Repository
    {
        private final String m_Name;

        private final Map<String, Long> m_LanguageScores;

        public String getName()
        {
            return m_Name;
        }

        public Map<String, Long> getLanguageScores()
        {
            return m_LanguageScores;
        }

        private Repository(JSONObject aRepositoryJSON) throws Exception
        {
            m_Name = aRepositoryJSON.get("name").toString();

            JSONParser parser = new JSONParser();

            m_LanguageScores = new HashMap<>();

            JSONObject languages = (JSONObject) parser.parse(
                    Resources.Remote.synchronousFetchText(buildURL(
                            ((JSONObject) aRepositoryJSON).get("languages_url").toString())));

            for (Iterator iterator = languages.keySet().iterator(); iterator.hasNext();)
            {
                String key = (String) iterator.next();

                m_LanguageScores.put(key, m_LanguageScores.containsKey(key)
                        ? (long) m_LanguageScores.get(key) + (long) languages.get(key)
                        : (long) languages.get(key));
            }
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
     * @param aOAuthToken an oauth token to perform authenticated api calls
     * with. This token does NOT have to be associated with aGithubAccountName
     * (for public repos) and is entirely optional. It is only needed in case
     * the user's external IP has exceeded the github api usage limit. (e.g. the
     * user is in the office of a software development company)
     * @throws Exception
     */
    public Github(
            final String aGithubAccountName, 
            final String aOAuthToken, 
            final boolean aIgnoreForks,
            final List<String> aRepoIgnoreList
    ) throws Exception
    {
        m_OAuthToken = aOAuthToken;
        m_RepoIgnoreList = aRepoIgnoreList;

        JSONParser parser = new JSONParser();

        final JSONArray repos;

        repos = (JSONArray) parser.parse(Resources.Remote.synchronousFetchText(
                buildURL("https://api.github.com/users/" + aGithubAccountName + "/repos")));

        for (final Object repo : repos)
            if (((Boolean) ((JSONObject) repo).get("fork")) != aIgnoreForks
                    && !m_RepoIgnoreList.contains(((JSONObject) repo).get("name")))
                m_Repositories.add(new Repository((JSONObject) repo));

        for (final Repository repo : m_Repositories)
        {
            final Map<String, Long> repoLanguageScores = repo.getLanguageScores();

            for (final String key : repoLanguageScores.keySet())
                m_TotalLanguageScores.put(key, m_TotalLanguageScores.containsKey(key)
                        ? (long) m_TotalLanguageScores.get(key) + (long) repoLanguageScores.get(key)
                        : (long) repoLanguageScores.get(key));
        }

        //
        // PRINT
        //
        System.out.println("**DATA**\n\n");

        for (final Repository repo : m_Repositories)
        {
            System.out.println("Repository: " + repo.getName());

            for (String key : repo.getLanguageScores().keySet())
                System.out.println(key + ": " + repo.getLanguageScores().get(key));

            System.out.println();
        }

        System.out.println("Account-wide language usage:");

        final List<Entry<String, Long>> sortedEntires = new ArrayList<>(m_TotalLanguageScores.entrySet());

        sortedEntires.sort((Entry<String, Long> l, Entry<String, Long> r) ->
        {
            return l.getValue() >= r.getValue() ? -1 : +1;
        });

        for (final Entry<String, Long> entry : sortedEntires)
            System.out.println(entry.getKey() + ": " + entry.getValue());

        System.out.println();

        System.out.println("Request count: " + m_RequestCout);
    }
}
