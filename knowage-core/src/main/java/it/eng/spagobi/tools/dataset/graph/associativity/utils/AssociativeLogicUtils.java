/*
 * Knowage, Open Source Business Intelligence suite
 * Copyright (C) 2016 Engineering Ingegneria Informatica S.p.A.

 * Knowage is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * Knowage is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package it.eng.spagobi.tools.dataset.graph.associativity.utils;

import it.eng.spagobi.tools.dataset.cache.query.item.SimpleFilter;
import it.eng.spagobi.tools.dataset.graph.EdgeGroup;
import it.eng.spagobi.tools.dataset.graph.LabeledEdge;
import it.eng.spagobi.tools.dataset.graph.Tuple;
import it.eng.spagobi.tools.dataset.graph.associativity.Config;
import it.eng.spagobi.tools.dataset.graph.associativity.container.IAssociativeDatasetContainer;
import org.apache.commons.lang.StringUtils;
import org.apache.metamodel.data.DataSet;
import org.jgrapht.graph.Pseudograph;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class AssociativeLogicUtils {

	public static String getUnlimitedInClauseValues(Set<String> values) {
		Set<String> newValues = new HashSet<>();
		for (String value : values) {
			newValues.add(value.replaceFirst("\\(", "(1,"));
		}
		return StringUtils.join(newValues.iterator(), ",");
	}

	public static Set<Tuple> getTupleOfValues(ResultSet rs) throws SQLException {
		Set<Tuple> tuples = new HashSet<>();
		while (rs.next()) {
			int n = rs.getMetaData().getColumnCount();
			Tuple tuple = new Tuple(n);
			for (int i = 1; i <= n; i++) {
				tuple.add(rs.getObject(i));
			}
			tuples.add(tuple);
		}
		return tuples;
	}

	public static Set<Tuple> getTupleOfValues(DataSet ds) {
		Set<Tuple> tuples = new HashSet<>();
		while (ds.next()) {
			int n = ds.getSelectItems().length;
			Tuple tuple = new Tuple(n);
			for (int i = 0; i < n; i++) {
				tuple.add(ds.getRow().getValue(i));
			}
			tuples.add(tuple);
		}
		return tuples;
	}

	public static Set<Tuple> getTupleOfValues(String parameterValues) {
		Set<Tuple> tuples = new HashSet<>();
		String[] values = parameterValues.split(",");
		for (int i = 0; i < values.length; i++) {
			Tuple tuple = new Tuple(1);
			tuple.add(values[i]);
			tuples.add(tuple);
		}
		return tuples;
	}

	public static EdgeGroup getOrCreate(Set<EdgeGroup> groups, EdgeGroup newGroup) {
		if (groups.contains(newGroup)) {
			for (EdgeGroup group : groups) {
				if (group.equals(newGroup)) {
					return group;
				}
			}
		}
		return newGroup;
	}

	public static void unresolveDatasetContainers(Collection<IAssociativeDatasetContainer> containers) {
		for (IAssociativeDatasetContainer container : containers) {
			container.unresolve();
			container.unresolveGroups();
		}
	}

	public static Config buildConfig(String strategy, Pseudograph<String, LabeledEdge<String>> graph, Map<String, Map<String, String>> datasetToAssociations,
			List<SimpleFilter> selections, Set<String> nearRealtimeDatasets, Map<String, Map<String, String>> datasetParameters, Set<String> documents) {
		Config config = new Config();
		config.setStrategy(strategy);
		config.setGraph(graph);
		config.setDatasetToAssociations(datasetToAssociations);
		config.setSelections(selections);
		config.setNearRealtimeDatasets(nearRealtimeDatasets);
		config.setDatasetParameters(datasetParameters);
		config.setDocuments(documents);
		return config;
	}
}